import { sql, hasDb, ensureSchema } from "./db";

type Event = {
  event: string;
  ip: string;
  source: string;
  country: string;
  city: string;
  device: string;
  os: string;
  browser: string;
  lang: string;
  tz: string;
  screen: string;
  meta: Record<string, string>;
  ts: string;
  // Reverse-IP network owner.
  org?: string; // network owner label ("Nvidia Corporation", "Carnegie Mellon University")
  asn?: string; // "AS15169"
  connType?: string; // company | institution | individual | hosting | mobile | unknown
  region?: string; // state / province from reverse-IP ("Iowa", "California")
  ua?: string; // raw User-Agent string (most revealing per-visit field)
  bot?: boolean; // true only for self-identifying crawlers, NOT cloud/VPN humans
  // PostHog-style behavioural fields (all optional / backward-compatible).
  sessionId?: string;
  deviceId?: string;
  durationMs?: number; // page_leave engaged time on a page
  scrollPct?: number; // page_leave max scroll depth (0–100)
  label?: string; // autocapture click label
};

// Rows pulled into memory for the detailed breakdowns. The KPI total, "since",
// and the timeline come from all-time aggregate queries, so this cap only bounds
// the *breakdown* sample, not the database — the dashboard still says "N total".
const RECENT_LIMIT = 5000;

// ── In-memory fallback (used only when no DATABASE_URL is configured) ──────────
// Lets local dev and un-provisioned deploys keep running; it just doesn't persist
// across instances or restarts. Provision Postgres and this path is never taken.
const MAX_EVENTS = 5000;
const mem: Event[] = [];

// ── Write path ────────────────────────────────────────────────────────────────
export async function record(e: Event): Promise<void> {
  if (!sql) {
    mem.push(e);
    if (mem.length > MAX_EVENTS) mem.splice(0, mem.length - MAX_EVENTS);
    return;
  }
  try {
    await ensureSchema();
    await sql`
      INSERT INTO analytics_events
        (ts, event, ip, source, country, city, device, os, browser, lang, tz,
         screen, org, asn, conn_type, region, ua, is_bot, session_id, device_id,
         duration_ms, scroll_pct, label, meta)
      VALUES
        (${e.ts}, ${e.event}, ${e.ip}, ${e.source}, ${e.country}, ${e.city},
         ${e.device}, ${e.os}, ${e.browser}, ${e.lang}, ${e.tz}, ${e.screen},
         ${e.org ?? null}, ${e.asn ?? null}, ${e.connType ?? null},
         ${e.region ?? null}, ${e.ua ?? null}, ${e.bot ?? false},
         ${e.sessionId ?? null}, ${e.deviceId ?? null},
         ${e.durationMs ?? null}, ${e.scrollPct ?? null}, ${e.label ?? null},
         ${JSON.stringify(e.meta ?? {})}::jsonb)
    `;
  } catch {
    // Never let instrumentation throw into the request path; fall back to memory
    // so the event isn't lost from this instance's view at least.
    mem.push(e);
    if (mem.length > MAX_EVENTS) mem.splice(0, mem.length - MAX_EVENTS);
  }
}

// ── Read path ─────────────────────────────────────────────────────────────────
type Row = Record<string, unknown>;

function rowToEvent(r: Row): Event {
  const ts = r.ts instanceof Date ? r.ts.toISOString() : String(r.ts);
  return {
    event: String(r.event ?? ""),
    ip: String(r.ip ?? ""),
    source: String(r.source ?? ""),
    country: String(r.country ?? ""),
    city: String(r.city ?? ""),
    device: String(r.device ?? ""),
    os: String(r.os ?? ""),
    browser: String(r.browser ?? ""),
    lang: String(r.lang ?? ""),
    tz: String(r.tz ?? ""),
    screen: String(r.screen ?? ""),
    meta: (r.meta as Record<string, string>) ?? {},
    ts,
    org: r.org ? String(r.org) : undefined,
    asn: r.asn ? String(r.asn) : undefined,
    connType: r.conn_type ? String(r.conn_type) : undefined,
    region: r.region ? String(r.region) : undefined,
    ua: r.ua ? String(r.ua) : undefined,
    bot: r.is_bot === true,
    sessionId: r.session_id ? String(r.session_id) : undefined,
    deviceId: r.device_id ? String(r.device_id) : undefined,
    durationMs: r.duration_ms == null ? undefined : Number(r.duration_ms),
    scrollPct: r.scroll_pct == null ? undefined : Number(r.scroll_pct),
    label: r.label ? String(r.label) : undefined,
  };
}

export async function getStats() {
  if (!sql) {
    // In-memory: total/since/timeline derived from the same array.
    const timeline = dailyCounts(mem);
    return aggregate(mem, mem.length, mem[0]?.ts ?? null, timeline);
  }

  try {
    await ensureSchema();
    // Recent rows for breakdowns, plus all-time total / since / per-day timeline.
    const [recentRows, totals, daily] = await Promise.all([
      sql`SELECT * FROM analytics_events ORDER BY ts DESC LIMIT ${RECENT_LIMIT}`,
      sql`SELECT count(*)::int AS total, min(ts) AS since FROM analytics_events`,
      sql`
        SELECT to_char(date_trunc('day', ts), 'YYYY-MM-DD') AS day, count(*)::int AS n
        FROM analytics_events
        GROUP BY 1
        ORDER BY 1 ASC
      `,
    ]);

    // Recent rows come back newest-first; the aggregation expects oldest-first.
    const events = (recentRows as Row[]).map(rowToEvent).reverse();
    const total = Number((totals as Row[])[0]?.total ?? events.length);
    const sinceRaw = (totals as Row[])[0]?.since;
    const since =
      sinceRaw instanceof Date ? sinceRaw.toISOString() : sinceRaw ? String(sinceRaw) : null;
    const timeline = (daily as Row[]).map((d) => [String(d.day), Number(d.n)] as [string, number]);

    return aggregate(events, total, since, timeline);
  } catch {
    // DB unreachable mid-request — degrade to whatever this instance buffered.
    const timeline = dailyCounts(mem);
    return aggregate(mem, mem.length, mem[0]?.ts ?? null, timeline);
  }
}

/** Per-day event counts for the in-memory fallback path. */
function dailyCounts(events: Event[]): [string, number][] {
  const byDay: Record<string, number> = {};
  for (const e of events) {
    const day = e.ts.slice(0, 10); // ISO "YYYY-MM-DD"
    byDay[day] = (byDay[day] || 0) + 1;
  }
  return Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * Pure aggregation over a set of events. Identical output to the original
 * in-memory getStats(), with `total`/`since`/`timeline` passed in so they can
 * reflect the whole database rather than just the sampled rows.
 */
function aggregate(
  events: Event[],
  total: number,
  since: string | null,
  timeline: [string, number][],
) {
  const uniqueIps = new Set(events.map((e) => e.ip));
  const sources: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const devices: Record<string, number> = {};
  const browsers: Record<string, number> = {};
  const oses: Record<string, number> = {};
  const eventTypes: Record<string, number> = {};
  const screens: Record<string, number> = {};
  const timezones: Record<string, number> = {};
  const languages: Record<string, number> = {};
  const hourly: Record<number, number> = {};
  const companies: Record<string, number> = {};
  const orgVisits: Event[] = [];
  // Network / bot granularity
  const networks: Record<string, number> = {};
  const connTypes: Record<string, number> = {};
  let botEvents = 0;
  const botDevices = new Set<string>();
  const humanDevices = new Set<string>();
  // Behavioural aggregates
  const clickLabels: Record<string, number> = {};
  const pages: Record<string, number> = {};
  const referrers: Record<string, number> = {};
  const sessions = new Set<string>();
  const visitors = new Set<string>();
  let dwellSum = 0;
  let dwellCount = 0;
  let scrollSum = 0;
  let scrollCount = 0;

  for (const e of events) {
    if (e.org && (e.connType === "company" || e.connType === "institution")) {
      companies[e.org] = (companies[e.org] || 0) + 1;
      orgVisits.push(e);
    }
    if (e.sessionId) sessions.add(e.sessionId);
    if (e.deviceId) visitors.add(e.deviceId);

    // Network granularity: name every owner (not just companies), and surface
    // cloud/VPN egress (Azure, AWS, GCP) plainly with its region instead of a
    // vague shield — these are usually real people on a corporate workspace.
    if (e.bot) botEvents++;
    if (e.connType) connTypes[e.connType] = (connTypes[e.connType] || 0) + 1;
    const netBase = e.org || (e.connType === "hosting" ? "cloud / VPN" : "");
    if (netBase) {
      const net = e.region ? `${netBase} · ${e.region}` : netBase;
      networks[net] = (networks[net] || 0) + 1;
    }
    if (e.deviceId) (e.bot ? botDevices : humanDevices).add(e.deviceId);
    if (e.event === "click" && e.label) clickLabels[e.label] = (clickLabels[e.label] || 0) + 1;
    if (e.event === "page_view") {
      const path = e.meta.path || "/";
      pages[path] = (pages[path] || 0) + 1;
      const r = e.meta.referrer || "direct";
      referrers[r] = (referrers[r] || 0) + 1;
    }
    if (e.event === "page_leave") {
      if (typeof e.durationMs === "number" && e.durationMs >= 0) {
        dwellSum += e.durationMs;
        dwellCount++;
      }
      if (typeof e.scrollPct === "number") {
        scrollSum += e.scrollPct;
        scrollCount++;
      }
    }
    sources[e.source] = (sources[e.source] || 0) + 1;
    const loc = [e.city, e.country].filter(Boolean).join(", ") || "unknown";
    countries[loc] = (countries[loc] || 0) + 1;
    devices[e.device] = (devices[e.device] || 0) + 1;
    browsers[e.browser] = (browsers[e.browser] || 0) + 1;
    oses[e.os] = (oses[e.os] || 0) + 1;
    eventTypes[e.event] = (eventTypes[e.event] || 0) + 1;
    if (e.screen) screens[e.screen] = (screens[e.screen] || 0) + 1;
    if (e.tz) timezones[e.tz] = (timezones[e.tz] || 0) + 1;
    if (e.lang) languages[e.lang] = (languages[e.lang] || 0) + 1;
    const hour = new Date(e.ts).getHours();
    hourly[hour] = (hourly[hour] || 0) + 1;
  }

  const sorted = (obj: Record<string, number>) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

  return {
    total,
    uniqueVisitors: uniqueIps.size,
    sessions: sessions.size,
    uniqueDevices: visitors.size,
    avgDwellMs: dwellCount ? Math.round(dwellSum / dwellCount) : 0,
    avgScrollPct: scrollCount ? Math.round(scrollSum / scrollCount) : 0,
    topClicks: sorted(clickLabels),
    topPages: sorted(pages),
    referrers: sorted(referrers),
    companyVisits: orgVisits.length,
    companies: sorted(companies),
    networks: sorted(networks),
    connTypes: sorted(connTypes),
    botEvents,
    humanVisitors: humanDevices.size,
    botVisitors: botDevices.size,
    recentCompanies: orgVisits
      .slice(-40)
      .reverse()
      .map((e) => ({
        org: e.org || "",
        connType: e.connType || "",
        asn: e.asn || "",
        location: [e.city, e.country].filter(Boolean).join(", ") || "unknown",
        source: e.source,
        page: e.meta.path || e.meta.project || e.event,
        ts: e.ts,
      })),
    sources: sorted(sources),
    locations: sorted(countries),
    devices: sorted(devices),
    browsers: sorted(browsers),
    oses: sorted(oses),
    eventTypes: sorted(eventTypes),
    screens: sorted(screens),
    timezones: sorted(timezones),
    languages: sorted(languages),
    hourly: Array.from(
      { length: 24 },
      (_, i) => [String(i).padStart(2, "0") + ":00", hourly[i] || 0] as [string, number],
    ),
    timeline,
    terminalQueries: events
      .filter((e) => e.event === "terminal_query" && e.meta.query)
      .slice(-30)
      .reverse()
      .map((e) => e.meta.query),
    projectClicks: sorted(
      events
        .filter((e) => e.event === "project_click" && e.meta.project)
        .reduce<Record<string, number>>((acc, e) => {
          acc[e.meta.project] = (acc[e.meta.project] || 0) + 1;
          return acc;
        }, {}),
    ),
    recent: events
      .slice(-50)
      .reverse()
      .map((e) => ({
        event: e.event,
        source: e.source,
        location: [e.city, e.region, e.country].filter(Boolean).join(", ") || "unknown",
        device: e.device,
        browser: e.browser,
        network: e.org || (e.connType === "hosting" ? "cloud / VPN" : ""),
        connType: e.connType || "",
        asn: e.asn || "",
        ua: e.ua || "",
        bot: e.bot === true,
        meta: e.meta,
        ts: e.ts,
      })),
    since,
    persistent: hasDb,
  };
}

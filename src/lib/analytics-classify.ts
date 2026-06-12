/**
 * Visitor classification for portfolio analytics.
 *
 * Two layers:
 * 1. Session metrics — raw counts from events in one browser session.
 * 2. Real-visitor score (0–100) — weighted signals with plain-English reasons.
 *
 * The score is intentionally transparent: every point comes from a named signal
 * so the dashboard can explain *why* a visit looks real or automated.
 */

export type VisitorKind = "crawler" | "datacenter_bounce" | "low_engagement" | "engaged";

export type VisitorVerdict = "high_value" | "likely_real" | "uncertain" | "likely_automated";

export type SignalCategory = "human" | "automated" | "context";

export type VisitorSignal = {
  id: string;
  label: string;
  delta: number;
  category: SignalCategory;
};

export type SessionEvent = {
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
  org?: string;
  asn?: string;
  connType?: string;
  region?: string;
  ua?: string;
  bot?: boolean;
  sessionId?: string;
  deviceId?: string;
  durationMs?: number;
  scrollPct?: number;
  label?: string;
};

export type SessionMetrics = {
  pageViews: number;
  clicks: number;
  projectClicks: number;
  terminalQueries: number;
  deadClicks: number;
  rageClicks: number;
  maxDwellMs: number;
  maxScrollPct: number;
  sessionDurationMs: number;
  uniquePages: number;
  uniqueViewports: number;
  visitedDashboard: boolean;
  visitedCaseStudy: boolean;
  visitedProjects: boolean;
  externalReferrer: boolean;
  pageReferrerRaw: string;
  returning: boolean;
  connType: string;
  network: string;
  asn: string;
  ua: string;
  isBotUa: boolean;
  isCompany: boolean;
};

export type SessionSummary = {
  sessionId: string;
  deviceId: string;
  kind: VisitorKind;
  kindLabel: string;
  reason: string;
  verdict: VisitorVerdict;
  verdictLabel: string;
  realScore: number;
  signals: VisitorSignal[];
  isCompany: boolean;
  startedAt: string;
  endedAt: string;
  events: number;
  pageViews: number;
  clicks: number;
  projectClicks: number;
  terminalQueries: number;
  maxDwellMs: number;
  sessionDurationMs: number;
  connType: string;
  network: string;
  location: string;
  pageReferrer: string;
  pages: string[];
  returning: boolean;
  visitedDashboard: boolean;
  visitedCaseStudy: boolean;
};

export type DeviceProfile = {
  deviceId: string;
  sessions: number;
  realScore: number;
  verdict: VisitorVerdict;
  verdictLabel: string;
  kind: VisitorKind;
  firstSeen: string;
  lastSeen: string;
  networks: string[];
  locations: string[];
  referrers: string[];
  pages: string[];
  isReturning: boolean;
  isHighValue: boolean;
  topSignals: string[];
};

const KIND_LABEL: Record<VisitorKind, string> = {
  crawler: "crawler",
  datacenter_bounce: "datacenter bounce",
  low_engagement: "low engagement",
  engaged: "engaged",
};

const VERDICT_LABEL: Record<VisitorVerdict, string> = {
  high_value: "high-value visitor",
  likely_real: "likely real",
  uncertain: "uncertain",
  likely_automated: "likely automated",
};

/** Cloud ASNs that often appear on uptime monitors / synthetic checks. */
const MONITOR_ASNS = new Set(["AS8075", "AS16509", "AS15169", "AS14618"]);

/** Chrome builds commonly seen on headless Azure monitors (not proof alone). */
const SYNTHETIC_CHROME = /Chrome\/142\.0\.7444\./;

export function isPortfolioHost(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h.includes("github.io") ||
    h.includes("vercel.app") ||
    h.includes("localhost") ||
    h.includes("127.0.0.1")
  );
}

function hostFromRef(ref: string): string {
  if (!ref || ref === "direct") return "";
  return ref
    .replace(/https?:\/\//, "")
    .split("/")[0]
    .toLowerCase();
}

export function classifySiteOrigin(httpReferer: string): string {
  const host = hostFromRef(httpReferer);
  if (!host) return "unknown";
  if (host.includes("github.io")) return "GitHub Pages";
  if (host.includes("vercel.app")) return "Vercel";
  if (host.includes("localhost") || host.includes("127.0.0.1")) return "local dev";
  return host;
}

export function classifyPageReferrer(ref: string): string {
  if (!ref || ref === "direct") return "direct";
  const host = hostFromRef(ref);
  if (!host) return "direct";
  if (host.includes("linkedin")) return "LinkedIn";
  if (host.includes("google")) return "Google";
  if (host.includes("github") && !host.includes("github.io")) return "GitHub";
  if (host.includes("twitter") || host.includes("x.com") || host.includes("t.co")) return "X/Twitter";
  if (host.includes("reddit")) return "Reddit";
  if (host.includes("bing")) return "Bing";
  if (isPortfolioHost(host)) return "direct";
  return host;
}

/** @deprecated alias */
export function classifySource(ref: string): string {
  return classifyPageReferrer(ref);
}

export function isBotUA(ua: string): boolean {
  return /bot\b|crawl|spider|slurp|bingpreview|facebookexternalhit|facebot|slackbot|discordbot|telegrambot|whatsapp|linkedinbot|twitterbot|embedly|quora link preview|pinterest|redditbot|applebot|petalbot|bytespider|ahrefs|semrush|mj12bot|dotbot|headless|phantomjs|puppeteer|playwright|python-requests|python-urllib|curl\/|wget\/|go-http-client|axios\/|node-fetch|scrapy/i.test(
    ua,
  );
}

/** Stable key for grouping events into one browser session (exported for store lookups). */
export function sessionLookupKey(e: SessionEvent): string {
  if (e.sessionId) return e.sessionId;
  const day = e.ts.slice(0, 10);
  return `${e.deviceId || e.ip || "anon"}:${day}`;
}

function sessionKey(e: SessionEvent): string {
  return sessionLookupKey(e);
}

const LEGACY_SITE_ORIGIN_SOURCES = new Set(["GitHub", "GitHub Pages", "Vercel"]);

/**
 * Re-derive attribution for stored rows. Legacy ingest wrote the API HTTP Referer
 * (github.io) into `source` instead of the visitor's page referrer.
 */
export function normalizeEvent(e: SessionEvent): SessionEvent {
  const pageRef = e.meta.referrer || "";
  let attribution = classifyPageReferrer(pageRef && pageRef !== "direct" ? pageRef : "direct");

  if (attribution === "direct" && e.source) {
    if (e.source === "GitHub" || e.source === "GitHub Pages") {
      attribution = "direct";
    } else if (!LEGACY_SITE_ORIGIN_SOURCES.has(e.source)) {
      attribution = e.source;
    }
  }

  const siteOrigin =
    e.meta.site_origin ||
    (e.source === "GitHub" || e.source === "GitHub Pages" ? "GitHub Pages" : "") ||
    "unknown";

  return {
    ...e,
    source: attribution,
    meta: { ...e.meta, site_origin: siteOrigin },
  };
}

export function isLikelyRealVerdict(v: VisitorVerdict): boolean {
  return v === "likely_real" || v === "high_value";
}

export function isAutomatedVerdict(v: VisitorVerdict): boolean {
  return v === "likely_automated";
}

/** Skip Discord pings for passive datacenter / crawler noise (matches session rollup rules). */
export function shouldSkipDiscordNotify(
  event: string,
  bot: boolean,
  connType: string | undefined,
  isOrg: boolean,
): boolean {
  if (bot) return true;
  if (isOrg) return false;
  if (connType !== "hosting") return false;
  return (
    event === "page_view" ||
    event === "session_start" ||
    event === "page_leave" ||
    event === "session_end"
  );
}

function networkLabel(e: SessionEvent): string {
  if (e.org) return e.region ? `${e.org} · ${e.region}` : e.org;
  if (e.connType === "hosting") return "cloud / VPN";
  return "";
}

function locationLabel(e: SessionEvent): string {
  return [e.city, e.region, e.country].filter(Boolean).join(", ") || "unknown";
}

function isExternalReferrer(ref: string): boolean {
  const labeled = classifyPageReferrer(ref);
  return labeled !== "direct" && !isPortfolioHost(hostFromRef(ref));
}

function extractMetrics(sorted: SessionEvent[]): SessionMetrics {
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const started = new Date(first.ts).getTime();
  const ended = new Date(last.ts).getTime();

  const pages = sorted.map((e) => e.meta.path).filter((p): p is string => Boolean(p));
  const uniquePages = new Set(pages);
  const viewports = new Set(sorted.map((e) => e.meta.viewport).filter(Boolean));

  const pageReferrerRaw =
    sorted.find((e) => e.event === "page_view" && e.meta.referrer)?.meta.referrer || "direct";

  const ua = first.ua || "";
  const connType = first.connType || "";

  return {
    pageViews: sorted.filter((e) => e.event === "page_view").length,
    clicks: sorted.filter((e) => e.event === "click").length,
    projectClicks: sorted.filter((e) => e.event === "project_click").length,
    terminalQueries: sorted.filter((e) => e.event === "terminal_query").length,
    deadClicks: sorted.filter((e) => e.event === "dead_click").length,
    rageClicks: sorted.filter((e) => e.event === "rage_click").length,
    maxDwellMs: sorted.reduce(
      (max, e) => (typeof e.durationMs === "number" ? Math.max(max, e.durationMs) : max),
      0,
    ),
    maxScrollPct: sorted.reduce(
      (max, e) => (typeof e.scrollPct === "number" ? Math.max(max, e.scrollPct) : max),
      0,
    ),
    sessionDurationMs: Math.max(0, ended - started),
    uniquePages: uniquePages.size,
    uniqueViewports: viewports.size,
    visitedDashboard: pages.some((p) => p.startsWith("/dashboard")),
    visitedCaseStudy: pages.some((p) => p.startsWith("/case/")),
    visitedProjects: pages.some((p) => p === "/projects" || p.startsWith("/projects")),
    externalReferrer: isExternalReferrer(pageReferrerRaw),
    pageReferrerRaw,
    returning: sorted.some((e) => e.meta.returning === "yes"),
    connType,
    network: networkLabel(first),
    asn: first.asn || "",
    ua,
    isBotUa: sorted.some((e) => e.bot) || isBotUA(ua),
    isCompany: connType === "company" || connType === "institution",
  };
}

function lifecycleOnly(sorted: SessionEvent[]): boolean {
  const types = new Set(sorted.map((e) => e.event));
  return [...types].every((t) => t === "session_start" || t === "page_view" || t === "page_leave");
}

/**
 * Score how likely a session is a real human (0–100) and list every signal used.
 */
export function scoreSession(
  sorted: SessionEvent[],
  metrics: SessionMetrics,
): { realScore: number; signals: VisitorSignal[] } {
  const signals: VisitorSignal[] = [];
  let score = 50; // neutral prior — prove human or automated from evidence

  const add = (id: string, label: string, delta: number, category: SignalCategory) => {
    score += delta;
    signals.push({ id, label, delta, category });
  };

  // ── Hard automated signals ──────────────────────────────────────────────
  if (metrics.isBotUa) {
    add("bot_ua", "User-Agent identifies as crawler/automation", -80, "automated");
  }

  if (metrics.connType === "hosting" && lifecycleOnly(sorted)) {
    add("hosting_lifecycle", "Datacenter IP with only load/leave — no interaction", -28, "automated");
  }

  if (
    metrics.connType === "hosting" &&
    metrics.clicks === 0 &&
    metrics.deadClicks === 0 &&
    metrics.terminalQueries === 0 &&
    metrics.projectClicks === 0 &&
    metrics.maxDwellMs < 20_000 &&
    metrics.sessionDurationMs < 25_000
  ) {
    add("hosting_quick_bounce", "Cloud IP, exited in under ~20s with zero interaction", -22, "automated");
  }

  if (metrics.asn && MONITOR_ASNS.has(metrics.asn) && metrics.clicks === 0 && metrics.deadClicks === 0) {
    add("known_monitor_asn", "Known cloud monitor ASN with no mouse activity", -18, "automated");
  }

  if (SYNTHETIC_CHROME.test(metrics.ua) && metrics.connType === "hosting" && metrics.deadClicks === 0) {
    add("synthetic_chrome", "Headless-style Chrome build on datacenter IP", -15, "automated");
  }

  if (metrics.pageViews > 0 && metrics.sessionDurationMs < 4_000 && metrics.clicks === 0) {
    add("flash_bounce", "Page loaded and left in under 4 seconds", -12, "automated");
  }

  // ── Strong human signals ──────────────────────────────────────────────────
  if (metrics.deadClicks > 0) {
    add(
      "dead_click",
      `Dead click${metrics.deadClicks > 1 ? "s" : ""} — real mouse, missed target`,
      22,
      "human",
    );
  }

  if (metrics.terminalQueries > 0) {
    add("terminal", "Used the AI terminal", 28, "human");
  }

  if (metrics.projectClicks > 0) {
    add("project_click", "Clicked into a project", 24, "human");
  }

  if (metrics.clicks > 0) {
    add("clicks", `${metrics.clicks} UI click${metrics.clicks === 1 ? "" : "s"}`, Math.min(metrics.clicks * 8, 24), "human");
  }

  if (metrics.rageClicks > 0) {
    add("rage_click", "Rage click pattern — frustrated human clicking", 12, "human");
  }

  if (metrics.maxDwellMs >= 60_000) {
    add("long_dwell", `Spent ${Math.round(metrics.maxDwellMs / 1000)}s on a page`, 18, "human");
  } else if (metrics.maxDwellMs >= 15_000) {
    add("medium_dwell", `Spent ${Math.round(metrics.maxDwellMs / 1000)}s on a page`, 10, "human");
  }

  if (metrics.uniquePages >= 3) {
    add("multi_page", `Viewed ${metrics.uniquePages} different pages`, 14, "human");
  } else if (metrics.uniquePages === 2) {
    add("two_pages", "Viewed 2 pages in one session", 8, "human");
  }

  if (metrics.visitedCaseStudy) {
    add("case_study", "Opened a case study", 12, "human");
  }

  if (metrics.visitedDashboard) {
    add("dashboard", "Visited analytics dashboard", 8, "context");
  }

  if (metrics.visitedProjects) {
    add("projects", "Browsed projects page", 8, "human");
  }

  if (metrics.uniqueViewports >= 2) {
    add("resize", "Changed viewport size — window resize or devtools", 8, "human");
  }

  if (metrics.maxScrollPct >= 50 && metrics.maxDwellMs >= 5_000) {
    add("scroll", `Scrolled to ${metrics.maxScrollPct}% of page`, 6, "human");
  }

  // ── Context signals (network + attribution) ───────────────────────────────
  if (metrics.isCompany) {
    add("company_network", "Corporate or university network", 20, "context");
  } else if (metrics.connType === "individual") {
    add("residential", "Residential ISP — home internet", 12, "context");
  } else if (metrics.connType === "mobile") {
    add("mobile_network", "Mobile carrier or VPN", 6, "context");
  }

  if (metrics.externalReferrer) {
    add(
      "external_referrer",
      `Arrived from ${classifyPageReferrer(metrics.pageReferrerRaw)}`,
      14,
      "context",
    );
  }

  if (metrics.returning) {
    add("returning", "Returning visitor (seen before on this device)", 10, "context");
  }

  if (sorted.some((e) => e.sessionId && e.deviceId)) {
    add("client_js", "Client analytics JS executed (session + device IDs present)", 8, "human");
  }

  const realScore = Math.max(0, Math.min(100, Math.round(score)));
  return { realScore, signals };
}

export function verdictFromScore(
  realScore: number,
  metrics: SessionMetrics,
  kind: VisitorKind,
): VisitorVerdict {
  if (kind === "crawler") return "likely_automated";
  if (metrics.isCompany && realScore >= 35 && kind !== "datacenter_bounce") {
    return "high_value";
  }
  if (realScore >= 68) return "likely_real";
  if (realScore < 38 && (kind === "datacenter_bounce" || metrics.connType === "hosting")) {
    return "likely_automated";
  }
  if (realScore < 32) return "likely_automated";
  return "uncertain";
}

function kindFromScore(realScore: number, metrics: SessionMetrics, sorted: SessionEvent[]): VisitorKind {
  if (metrics.isBotUa) return "crawler";

  const hasInteraction =
    metrics.clicks > 0 ||
    metrics.projectClicks > 0 ||
    metrics.terminalQueries > 0 ||
    metrics.deadClicks > 0 ||
    metrics.rageClicks > 0;

  if (
    metrics.connType === "hosting" &&
    !hasInteraction &&
    metrics.maxDwellMs < 30_000 &&
    metrics.pageViews <= 2 &&
    realScore < 45
  ) {
    return "datacenter_bounce";
  }

  if (
    hasInteraction ||
    metrics.maxDwellMs >= 15_000 ||
    metrics.uniquePages >= 3 ||
    realScore >= 62
  ) {
    return "engaged";
  }

  return "low_engagement";
}

function primaryReason(signals: VisitorSignal[], kind: VisitorKind, realScore: number): string {
  const human = signals.filter((s) => s.category === "human" && s.delta > 0);
  const automated = signals.filter((s) => s.category === "automated" && s.delta < 0);

  if (kind === "crawler") {
    return automated[0]?.label ?? "Automated crawler User-Agent";
  }

  if (human.length > 0 && realScore >= 55) {
    return human
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3)
      .map((s) => s.label)
      .join(" · ");
  }

  if (automated.length > 0 && realScore < 45) {
    return automated
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 2)
      .map((s) => s.label)
      .join(" · ");
  }

  if (kind === "datacenter_bounce") {
    return "Datacenter IP with no meaningful interaction";
  }

  return kind === "engaged" ? "Meaningful on-site behavior" : "Visited but limited interaction so far";
}

export function classifySession(events: SessionEvent[]): Omit<SessionSummary, "sessionId" | "deviceId"> {
  const sorted = [...events].sort((a, b) => a.ts.localeCompare(b.ts));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const metrics = extractMetrics(sorted);
  const { realScore, signals } = scoreSession(sorted, metrics);
  const kind = kindFromScore(realScore, metrics, sorted);
  const verdict = verdictFromScore(realScore, metrics, kind);

  const pages = [
    ...new Set(sorted.map((e) => e.meta.path).filter((p): p is string => Boolean(p))),
  ];

  return {
    kind,
    kindLabel: KIND_LABEL[kind],
    reason: primaryReason(signals, kind, realScore),
    verdict,
    verdictLabel: VERDICT_LABEL[verdict],
    realScore,
    signals,
    isCompany: metrics.isCompany,
    startedAt: first.ts,
    endedAt: last.ts,
    events: sorted.length,
    pageViews: metrics.pageViews,
    clicks: metrics.clicks,
    projectClicks: metrics.projectClicks,
    terminalQueries: metrics.terminalQueries,
    maxDwellMs: metrics.maxDwellMs,
    sessionDurationMs: metrics.sessionDurationMs,
    connType: metrics.connType,
    network: metrics.network,
    location: locationLabel(first),
    pageReferrer: classifyPageReferrer(metrics.pageReferrerRaw),
    pages,
    returning: metrics.returning,
    visitedDashboard: metrics.visitedDashboard,
    visitedCaseStudy: metrics.visitedCaseStudy,
  };
}

export function rollupSessions(events: SessionEvent[], limit?: number): SessionSummary[] {
  const buckets = new Map<string, SessionEvent[]>();
  for (const e of events) {
    const key = sessionKey(e);
    const list = buckets.get(key) ?? [];
    list.push(e);
    buckets.set(key, list);
  }

  const rolled = [...buckets.entries()]
    .map(([key, evs]) => {
      const classified = classifySession(evs);
      const deviceId = evs.find((e) => e.deviceId)?.deviceId || "";
      return {
        sessionId: evs.find((e) => e.sessionId)?.sessionId || key,
        deviceId,
        ...classified,
      };
    })
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  return limit != null ? rolled.slice(0, limit) : rolled;
}

/** Group sessions by device to spot repeat humans vs one-off monitors. */
export function rollupDevices(sessions: SessionSummary[], limit = 25): DeviceProfile[] {
  const byDevice = new Map<string, SessionSummary[]>();
  for (const s of sessions) {
    const key = s.deviceId || s.sessionId;
    const list = byDevice.get(key) ?? [];
    list.push(s);
    byDevice.set(key, list);
  }

  return [...byDevice.entries()]
    .map(([deviceId, list]) => {
      const sorted = [...list].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
      const best = [...list].sort((a, b) => b.realScore - a.realScore)[0];
      const humanSignals = best.signals
        .filter((s) => s.delta > 0)
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 3)
        .map((s) => s.label);

      return {
        deviceId: deviceId.slice(0, 12),
        sessions: list.length,
        realScore: best.realScore,
        verdict: best.verdict,
        verdictLabel: best.verdictLabel,
        kind: best.kind,
        firstSeen: sorted[0].startedAt,
        lastSeen: sorted[sorted.length - 1].endedAt,
        networks: [...new Set(list.map((s) => s.network).filter(Boolean))],
        locations: [...new Set(list.map((s) => s.location))],
        referrers: [...new Set(list.map((s) => s.pageReferrer))],
        pages: [...new Set(list.flatMap((s) => s.pages))],
        isReturning: list.some((s) => s.returning) || list.length > 1,
        isHighValue: list.some((s) => s.isCompany),
        topSignals: humanSignals,
      };
    })
    .sort((a, b) => b.realScore - a.realScore)
    .slice(0, limit);
}

export function countSessionsByKind(sessions: SessionSummary[]): [VisitorKind, number][] {
  const counts: Record<VisitorKind, number> = {
    crawler: 0,
    datacenter_bounce: 0,
    low_engagement: 0,
    engaged: 0,
  };
  for (const s of sessions) counts[s.kind]++;
  return (Object.entries(counts) as [VisitorKind, number][]).sort((a, b) => b[1] - a[1]);
}

export function countSessionsByVerdict(sessions: SessionSummary[]): [VisitorVerdict, number][] {
  const counts: Record<VisitorVerdict, number> = {
    high_value: 0,
    likely_real: 0,
    uncertain: 0,
    likely_automated: 0,
  };
  for (const s of sessions) counts[s.verdict]++;
  return (Object.entries(counts) as [VisitorVerdict, number][]).sort((a, b) => b[1] - a[1]);
}

export function kindColor(kind: VisitorKind): string {
  switch (kind) {
    case "engaged":
      return "#5ba864";
    case "low_engagement":
      return "#e8b84a";
    case "datacenter_bounce":
      return "#9b59b6";
    case "crawler":
      return "#999";
  }
}

export function verdictColor(verdict: VisitorVerdict): string {
  switch (verdict) {
    case "high_value":
      return "#e8b84a";
    case "likely_real":
      return "#5ba864";
    case "uncertain":
      return "#6b8cae";
    case "likely_automated":
      return "#999";
  }
}

import { createFileRoute } from "@tanstack/react-router";
import {
  kindColor,
  verdictColor,
  type VisitorKind,
  type VisitorVerdict,
} from "@/lib/analytics-classify";
import { apiUrl } from "@/lib/api";
import { Fragment, useEffect, useState, type CSSProperties } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard" }] }),
});

type Stats = {
  total: number;
  uniqueVisitors: number;
  likelyRealDevices?: number;
  sessions: number;
  uniqueDevices: number;
  avgDwellMs: number;
  avgScrollPct: number;
  topClicks: [string, number][];
  topPages: [string, number][];
  referrers: [string, number][];
  companyVisits: number;
  companies: [string, number][];
  networks: [string, number][];
  connTypes: [string, number][];
  botEvents: number;
  humanVisitors: number;
  botVisitors: number;
  recentCompanies: {
    org: string;
    connType: string;
    asn: string;
    location: string;
    source: string;
    pageReferrer?: string;
    verdict?: VisitorVerdict;
    realScore?: number;
    page: string;
    ts: string;
  }[];
  sources: [string, number][];
  locations: [string, number][];
  devices: [string, number][];
  browsers: [string, number][];
  oses: [string, number][];
  eventTypes: [string, number][];
  screens: [string, number][];
  timezones: [string, number][];
  languages: [string, number][];
  hourly: [string, number][];
  timeline: [string, number][];
  terminalQueries: string[];
  projectClicks: [string, number][];
  recent: {
    event: string;
    source: string;
    pageReferrer?: string;
    location: string;
    device: string;
    browser: string;
    network: string;
    connType: string;
    asn: string;
    ua: string;
    bot: boolean;
    verdict?: VisitorVerdict;
    verdictLabel?: string;
    realScore?: number;
    sessionKind?: VisitorKind;
    meta: Record<string, string>;
    ts: string;
  }[];
  since: string | null;
  persistent?: boolean;
  pageReferrers?: [string, number][];
  siteOrigins?: [string, number][];
  visitorQuality?: {
    engagedSessions: number;
    lowEngagementSessions: number;
    datacenterBounces: number;
    crawlerSessions: number;
    likelyRealSessions: number;
    likelyAutomatedSessions: number;
    highValueSessions: number;
    totalSessions: number;
  };
  sessionsByKind?: [VisitorKind, number][];
  sessionsByVerdict?: [VisitorVerdict, number][];
  sessionRollups?: SessionRollup[];
  deviceProfiles?: DeviceProfile[];
};

type SessionSignal = {
  id: string;
  label: string;
  delta: number;
  category: "human" | "automated" | "context";
};

type SessionRollup = {
  sessionId: string;
  deviceId: string;
  kind: VisitorKind;
  kindLabel: string;
  verdict: VisitorVerdict;
  verdictLabel: string;
  realScore: number;
  signals: SessionSignal[];
  reason: string;
  isCompany: boolean;
  startedAt: string;
  endedAt: string;
  events: number;
  pageViews: number;
  clicks: number;
  projectClicks: number;
  terminalQueries: number;
  maxDwellSec: number;
  sessionDurationSec: number;
  connType: string;
  network: string;
  location: string;
  pageReferrer: string;
  pages: string;
  returning: boolean;
  visitedDashboard: boolean;
  visitedCaseStudy: boolean;
};

type DeviceProfile = {
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

const TABS = [
  "overview",
  "quality",
  "timeline",
  "behavior",
  "companies",
  "live feed",
  "terminal",
  "traffic",
] as const;
type Tab = (typeof TABS)[number];

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [realOnly, setRealOnly] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    const load = () =>
      fetch(apiUrl("/api/dashboard"))
        .then((r) => r.json())
        .then((d) => setStats(d as Stats))
        .catch(() => setError("failed"));
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (isMobile)
    return (
      <div style={S.page}>
        <p style={{ color: "#666", padding: 40 }}>desktop only</p>
      </div>
    );
  if (error)
    return (
      <div style={S.page}>
        <p style={{ color: "#c00", padding: 40 }}>{error}</p>
      </div>
    );
  if (!stats)
    return (
      <div style={S.page}>
        <p style={{ color: "#666", padding: 40 }}>loading...</p>
      </div>
    );

  const pageViews = stats.eventTypes.find(([e]) => e === "page_view")?.[1] ?? 0;
  const clicks = stats.eventTypes.find(([e]) => e === "project_click")?.[1] ?? 0;
  const quality = stats.visitorQuality;
  const sessionRows = (stats.sessionRollups ?? []).filter(
    (s) =>
      !realOnly || s.verdict === "likely_real" || s.verdict === "high_value",
  );

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div>
          <h1 style={S.h1}>workbench analytics</h1>
          <p style={S.meta}>
            {stats.persistent ? "postgres · persistent" : "in-memory · resets on deploy"} · since{" "}
            {stats.since ? new Date(stats.since).toLocaleString() : "—"} · auto-refresh 10s
          </p>
        </div>
        <div style={S.live}>
          <span style={S.dot} />
          live
        </div>
      </header>

      {/* Tabs */}
      <div style={S.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={tab === t ? { ...S.tab, ...S.tabActive } : S.tab}
          >
            {t}
          </button>
        ))}
      </div>

      {/* KPIs — always visible */}
      <div style={S.kpis}>
        <KPI n={stats.total} label="events" />
        <KPI n={quality?.likelyRealSessions ?? stats.sessions ?? 0} label="likely real sessions" />
        <KPI n={quality?.engagedSessions ?? 0} label="engaged sessions" />
        <KPI n={quality?.datacenterBounces ?? 0} label="datacenter bounces" />
        <KPI n={stats.likelyRealDevices ?? stats.uniqueVisitors} label="likely real devices" />
        <KPI n={stats.companyVisits ?? 0} label="company hits (real sessions)" />
      </div>

      {/* ── Overview tab ── */}
      {tab === "overview" && (
        <>
          <div style={S.grid3}>
            <Card title="how visitors found you (page referrer, excl. monitors)">
              <Bars data={stats.pageReferrers?.length ? stats.pageReferrers : stats.sources} />
            </Card>
            <Card title="location">
              <Bars data={stats.locations} />
            </Card>
            <Card title="device">
              <Bars data={stats.devices} />
            </Card>
          </div>
          <div style={S.grid3}>
            <Card title="browser">
              <Bars data={stats.browsers} />
            </Card>
            <Card title="operating system">
              <Bars data={stats.oses} />
            </Card>
            <Card title="event type">
              <Bars data={stats.eventTypes} />
            </Card>
          </div>
          <Card title="hourly activity">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
              {stats.hourly.map(([hour, count]) => {
                const max = Math.max(...stats.hourly.map(([, c]) => c), 1);
                const pct = (count / max) * 100;
                return (
                  <div
                    key={hour}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        background: count > 0 ? "#b43a24" : "#eee",
                        height: `${Math.max(pct, 2)}%`,
                        borderRadius: 2,
                        transition: "height 0.3s",
                      }}
                      title={`${hour}: ${count}`}
                    />
                    <span style={{ fontSize: 8, color: "#999" }}>{hour.replace(":00", "")}</span>
                  </div>
                );
              })}
            </div>
          </Card>
          {stats.projectClicks.length > 0 && (
            <Card title="project clicks">
              <Bars data={stats.projectClicks} />
            </Card>
          )}
        </>
      )}

      {/* ── Quality tab ── */}
      {tab === "quality" && (
        <>
          <Card title="real-visitor score (0–100)">
            <p style={{ fontSize: 11, color: "#777", lineHeight: 1.7, margin: "0 0 12px" }}>
              Each session starts at 50 and gains or loses points from named signals.{" "}
              <strong>Dead clicks</strong> and <strong>terminal use</strong> are strong human proof.{" "}
              <strong>Datacenter bounces</strong> with no mouse activity score low. Click a session
              row to see every signal that moved the score.
            </p>
            {stats.sessionsByVerdict?.length ? (
              <Bars
                data={stats.sessionsByVerdict.map(([v, count]) => [
                  v.replace(/_/g, " "),
                  count,
                ])}
              />
            ) : (
              <p style={{ color: "#999", padding: 16, textAlign: "center" }}>no sessions yet</p>
            )}
          </Card>

          {quality && (
            <div style={S.kpis}>
              <KPI n={quality.likelyRealSessions} label="likely real" />
              <KPI n={quality.highValueSessions} label="high-value" />
              <KPI n={quality.likelyAutomatedSessions} label="likely automated" />
              <KPI n={quality.datacenterBounces} label="datacenter bounce" />
              <KPI n={quality.totalSessions} label="sessions total" />
            </div>
          )}

          <Card title="repeat visitors by device">
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {[
                      "device",
                      "score",
                      "verdict",
                      "sessions",
                      "networks",
                      "location",
                      "referrers",
                      "pages",
                      "signals",
                    ].map((h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats.deviceProfiles ?? []).map((d, i) => (
                    <tr key={d.deviceId + i} style={i % 2 === 0 ? S.trAlt : undefined}>
                      <td style={S.td}>
                        <code>{d.deviceId}</code>
                        {d.isReturning ? (
                          <span style={{ marginLeft: 6, color: "#5ba864" }} title="returning">
                            ↩
                          </span>
                        ) : null}
                      </td>
                      <td style={S.td}>
                        <ScoreBar score={d.realScore} />
                      </td>
                      <td style={S.td}>
                        <VerdictBadge verdict={d.verdict} label={d.verdictLabel} />
                      </td>
                      <td style={S.td}>{d.sessions}</td>
                      <td style={{ ...S.td, color: "#777" }}>{d.networks.join(", ") || "—"}</td>
                      <td style={S.td}>{d.locations.join(" · ") || "—"}</td>
                      <td style={S.td}>{d.referrers.join(", ") || "—"}</td>
                      <td style={{ ...S.td, color: "#999", maxWidth: 160, whiteSpace: "normal" }}>
                        {d.pages.slice(0, 4).join(", ") || "—"}
                      </td>
                      <td
                        style={{ ...S.td, color: "#777", maxWidth: 200, whiteSpace: "normal" }}
                      >
                        {d.topSignals.join(" · ") || "—"}
                      </td>
                    </tr>
                  ))}
                  {!stats.deviceProfiles?.length && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ ...S.td, textAlign: "center", color: "#999", padding: 40 }}
                      >
                        no devices yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div style={S.grid3}>
            <Card title="site origin (where app is hosted)">
              {stats.siteOrigins?.length ? (
                <Bars data={stats.siteOrigins} />
              ) : (
                <p style={{ fontSize: 11, color: "#999", lineHeight: 1.6 }}>
                  Tracked on new events after deploy. Older rows may only show API referer as
                  &quot;GitHub&quot;.
                </p>
              )}
            </Card>
            <Card title="page referrer">
              <Bars data={stats.pageReferrers?.length ? stats.pageReferrers : stats.sources} />
            </Card>
            <Card title="connection type">
              <Bars data={stats.connTypes} />
            </Card>
          </div>

          <Card title="session rollups — click a row for signal breakdown">
            <div style={{ marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setRealOnly((v) => !v)}
                style={{
                  ...S.tab,
                  marginBottom: 0,
                  borderBottom: "none",
                  padding: "6px 12px",
                  border: `1px solid ${realOnly ? "#5ba864" : "#e5e2dc"}`,
                  borderRadius: 4,
                  color: realOnly ? "#5ba864" : "#999",
                }}
              >
                {realOnly ? "showing likely real only" : "show all sessions"}
              </button>
              <span style={{ fontSize: 10, color: "#999" }}>
                {sessionRows.length} session{sessionRows.length === 1 ? "" : "s"}
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {[
                      "",
                      "when",
                      "score",
                      "verdict",
                      "summary",
                      "referrer",
                      "network",
                      "location",
                      "pages",
                      "dwell",
                    ].map((h) => (
                      <th key={h || "expand"} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessionRows.map((s, i) => {
                    const rowKey = s.sessionId + i;
                    const open = expandedSession === rowKey;
                    return (
                      <Fragment key={rowKey}>
                        <tr
                          style={{
                            ...(i % 2 === 0 ? S.trAlt : {}),
                            cursor: "pointer",
                          }}
                          onClick={() => setExpandedSession(open ? null : rowKey)}
                        >
                          <td style={{ ...S.td, color: "#bbb", width: 20 }}>{open ? "▼" : "▶"}</td>
                          <td style={S.td}>{new Date(s.startedAt).toLocaleString()}</td>
                          <td style={S.td}>
                            <ScoreBar score={s.realScore} />
                          </td>
                          <td style={S.td}>
                            <VerdictBadge verdict={s.verdict} label={s.verdictLabel} />
                          </td>
                          <td
                            style={{ ...S.td, color: "#777", maxWidth: 220, whiteSpace: "normal" }}
                          >
                            {s.reason}
                          </td>
                          <td style={S.td}>{s.pageReferrer}</td>
                          <td style={S.td}>
                            {s.network || "—"}
                            {s.connType ? (
                              <span style={{ color: "#bbb", marginLeft: 4 }}>({s.connType})</span>
                            ) : null}
                          </td>
                          <td style={S.td}>{s.location}</td>
                          <td style={{ ...S.td, color: "#999" }}>{s.pages}</td>
                          <td style={S.td}>
                            {s.maxDwellSec > 0 ? `${s.maxDwellSec}s` : `${s.sessionDurationSec}s`}
                          </td>
                        </tr>
                        {open ? (
                          <tr key={`${rowKey}-signals`}>
                            <td colSpan={10} style={{ ...S.td, padding: "8px 12px 16px" }}>
                              <SignalList signals={s.signals} />
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                  {!sessionRows.length && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{ ...S.td, textAlign: "center", color: "#999", padding: 40 }}
                      >
                        no sessions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── Timeline tab ── */}
      {tab === "timeline" && <Timeline data={stats.timeline} total={stats.total} />}

      {/* ── Behavior tab ── */}
      {tab === "behavior" && (
        <>
          <div style={S.kpis}>
            <KPI n={stats.sessions ?? 0} label="sessions" />
            <KPI n={stats.uniqueDevices ?? 0} label="unique devices" />
            <KPI n={Math.round((stats.avgDwellMs ?? 0) / 1000)} label="avg sec / page" />
            <KPI n={stats.avgScrollPct ?? 0} label="avg scroll %" />
            <KPI
              n={stats.eventTypes.find(([e]) => e === "rage_click")?.[1] ?? 0}
              label="rage clicks"
            />
          </div>
          <div style={S.grid3}>
            <Card title="most clicked — autocapture">
              {stats.topClicks?.length ? (
                <Bars data={stats.topClicks} />
              ) : (
                <p style={{ color: "#999", padding: 16, textAlign: "center" }}>no clicks yet</p>
              )}
            </Card>
            <Card title="top pages">
              {stats.topPages?.length ? (
                <Bars data={stats.topPages} />
              ) : (
                <p style={{ color: "#999", padding: 16, textAlign: "center" }}>no pages yet</p>
              )}
            </Card>
            <Card title="raw page referrers">
              {stats.referrers?.length ? (
                <Bars data={stats.referrers} />
              ) : (
                <p style={{ color: "#999", padding: 16, textAlign: "center" }}>no referrers yet</p>
              )}
            </Card>
          </div>
          <Card title="event type breakdown">
            <Bars data={stats.eventTypes} />
          </Card>
        </>
      )}

      {/* ── Companies tab ── */}
      {tab === "companies" && (
        <>
          <Card title="companies & institutions — who's scouting you">
            {stats.companies.length > 0 ? (
              <Bars data={stats.companies} />
            ) : (
              <p style={{ color: "#999", padding: 20, textAlign: "center", lineHeight: 1.6 }}>
                no company hits yet — these only appear when a visitor is on a corporate or
                university network that owns its IP range (big tech, banks, universities like CMU).
                Home wifi, phones and VPNs don&apos;t resolve to a company.
              </p>
            )}
          </Card>
          <Card title="recent company visits">
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {[
                      "time",
                      "organization",
                      "type",
                      "score",
                      "asn",
                      "location",
                      "referrer",
                      "page",
                    ].map((h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentCompanies.map((c, i) => (
                    <tr key={i} style={i % 2 === 0 ? S.trAlt : undefined}>
                      <td style={S.td}>{new Date(c.ts).toLocaleTimeString()}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>
                        {c.connType === "institution" ? "🎓 " : "🏢 "}
                        {c.org}
                      </td>
                      <td style={S.td}>{c.connType}</td>
                      <td style={S.td}>
                        {c.realScore != null ? (
                          <VerdictBadge
                            verdict={c.verdict ?? "uncertain"}
                            score={c.realScore}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ ...S.td, color: "#999" }}>{c.asn || "—"}</td>
                      <td style={S.td}>{c.location}</td>
                      <td style={S.td}>{c.pageReferrer ?? c.source}</td>
                      <td style={{ ...S.td, color: "#999" }}>{c.page}</td>
                    </tr>
                  ))}
                  {stats.recentCompanies.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        style={{ ...S.td, textAlign: "center", color: "#999", padding: 40 }}
                      >
                        no company visits yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── Live Feed tab ── */}
      {tab === "live feed" && (
        <Card title="live event stream">
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {[
                    "time",
                    "event",
                    "score",
                    "referrer",
                    "network",
                    "location",
                    "device",
                    "browser",
                    "user agent",
                    "details",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((e, i) => (
                  <tr key={i} style={i % 2 === 0 ? S.trAlt : undefined}>
                    <td style={S.td}>{new Date(e.ts).toLocaleTimeString()}</td>
                    <td style={S.td}>
                      <span style={{ ...S.badge, background: evColor(e.event) }}>
                        {e.event.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={S.td}>
                      {e.realScore != null ? (
                        <VerdictBadge verdict={e.verdict ?? "uncertain"} score={e.realScore} />
                      ) : e.bot ? (
                        <span style={{ ...S.badge, background: "#999", fontSize: 9 }}>crawler</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={S.td}>{e.pageReferrer ?? e.source}</td>
                    <td style={S.td}>
                      {e.network ? (
                        <span title={`${e.connType}${e.asn ? " · " + e.asn : ""}`}>
                          {connTypeIcon(e.connType)} {e.network}
                        </span>
                      ) : (
                        <span style={{ color: "#ccc" }}>—</span>
                      )}
                      {e.bot && (
                        <span
                          style={{
                            marginLeft: 6,
                            ...S.badge,
                            background: "#999",
                            fontSize: 8,
                          }}
                        >
                          bot
                        </span>
                      )}
                    </td>
                    <td style={S.td}>{e.location}</td>
                    <td style={S.td}>{e.device}</td>
                    <td style={S.td}>{e.browser}</td>
                    <td
                      style={{
                        ...S.td,
                        color: "#999",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={e.ua || ""}
                    >
                      {e.ua || "—"}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        color: "#999",
                        maxWidth: 220,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {Object.entries(e.meta)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ") || "—"}
                    </td>
                  </tr>
                ))}
                {stats.recent.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ ...S.td, textAlign: "center", color: "#999", padding: 40 }}
                    >
                      no events yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Terminal tab ── */}
      {tab === "terminal" && (
        <>
          <Card title="terminal queries — what visitors are asking">
            {stats.terminalQueries.length > 0 ? (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={{ ...S.th, width: 40 }}>#</th>
                    <th style={S.th}>query</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.terminalQueries.map((q, i) => (
                    <tr key={i} style={i % 2 === 0 ? S.trAlt : undefined}>
                      <td style={{ ...S.td, color: "#999" }}>{i + 1}</td>
                      <td style={{ ...S.td, fontFamily: "monospace" }}>{q}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#999", padding: 20, textAlign: "center" }}>
                no terminal queries yet
              </p>
            )}
          </Card>
          <Card title="project clicks — which projects get attention">
            {stats.projectClicks.length > 0 ? (
              <Bars data={stats.projectClicks} />
            ) : (
              <p style={{ color: "#999", padding: 20, textAlign: "center" }}>
                no project clicks yet
              </p>
            )}
          </Card>
        </>
      )}

      {/* ── Traffic tab ── */}
      {tab === "traffic" && (
        <>
          <div style={S.kpis}>
            <KPI n={quality?.likelyRealSessions ?? 0} label="likely real sessions" />
            <KPI n={quality?.datacenterBounces ?? 0} label="datacenter bounces" />
            <KPI n={stats.botEvents ?? 0} label="crawler events (UA)" />
            <KPI n={stats.companyVisits ?? 0} label="company / edu hits" />
            <KPI n={stats.networks?.length ?? 0} label="distinct networks" />
          </div>
          <div style={S.grid3}>
            <Card title="networks — IP owner (incl. cloud / VPN)">
              {stats.networks?.length ? (
                <Bars data={stats.networks} />
              ) : (
                <p style={{ color: "#999", padding: 16, textAlign: "center" }}>no data yet</p>
              )}
            </Card>
            <Card title="connection type">
              {stats.connTypes?.length ? (
                <Bars data={stats.connTypes} />
              ) : (
                <p style={{ color: "#999", padding: 16, textAlign: "center" }}>no data yet</p>
              )}
            </Card>
            <Card title="reading cloud traffic">
              <p style={{ fontSize: 11, color: "#777", lineHeight: 1.6, padding: 4 }}>
                ☁️ Azure/AWS/GCP IPs with <strong>no clicks</strong> and a quick bounce are labeled{" "}
                <em>datacenter bounce</em> on the Quality tab — usually uptime monitors or CI, not
                recruiters. Cloud IPs with clicks, terminal use, or longer dwell are treated as{" "}
                <em>engaged</em> (often you on VPN or someone on a corporate workspace).
              </p>
            </Card>
          </div>
          <div style={S.grid3}>
            <Card title="how visitors found you">
              <Bars data={stats.pageReferrers?.length ? stats.pageReferrers : stats.sources} />
            </Card>
            <Card title="location">
              <Bars data={stats.locations} />
            </Card>
            <Card title="device">
              <Bars data={stats.devices} />
            </Card>
          </div>
          <div style={S.grid3}>
            <Card title="timezone">
              <Bars data={stats.timezones} />
            </Card>
            <Card title="language">
              <Bars data={stats.languages} />
            </Card>
            <Card title="screen resolution">
              <Bars data={stats.screens} />
            </Card>
          </div>

          <Card title="recent sessions (see Quality tab for full detail)">
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["when", "verdict", "kind", "referrer", "network", "location", "events"].map(
                      (h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats.sessionRollups ?? []).slice(0, 15).map((s, i) => (
                    <tr key={s.sessionId + i} style={i % 2 === 0 ? S.trAlt : undefined}>
                      <td style={S.td}>{new Date(s.startedAt).toLocaleString()}</td>
                      <td style={S.td}>
                        <VerdictBadge verdict={s.verdict} score={s.realScore} />
                      </td>
                      <td style={S.td}>
                        <KindBadge kind={s.kind} label={s.kindLabel} company={s.isCompany} />
                      </td>
                      <td style={S.td}>{s.pageReferrer}</td>
                      <td style={S.td}>{s.network || "—"}</td>
                      <td style={S.td}>{s.location}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{s.events}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <footer style={S.footer}>
        {stats.total} events · {stats.likelyRealDevices ?? stats.uniqueVisitors} likely real
        devices · {quality?.likelyAutomatedSessions ?? 0} automated sessions filtered from
        breakdowns · since {stats.since ? new Date(stats.since).toLocaleString() : "—"}
      </footer>
    </div>
  );
}

function KindBadge({
  kind,
  label,
  company,
}: {
  kind: VisitorKind;
  label: string;
  company?: boolean;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ ...S.badge, background: kindColor(kind) }}>{label}</span>
      {company ? <span title="company / university network">🏢</span> : null}
    </span>
  );
}

function VerdictBadge({
  verdict,
  label,
  score,
}: {
  verdict: VisitorVerdict;
  label?: string;
  score?: number;
}) {
  const text = label ?? (score != null ? String(score) : verdict.replace(/_/g, " "));
  return <span style={{ ...S.badge, background: verdictColor(verdict) }}>{text}</span>;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 68 ? "#5ba864" : score >= 38 ? "#e8b84a" : score >= 0 ? "#999" : "#b43a24";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 72 }}>
      <span style={{ fontWeight: 700, color }}>{score}</span>
      <span
        style={{
          display: "inline-block",
          width: 48,
          height: 5,
          background: "#f0ede8",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${score}%`,
            background: color,
            borderRadius: 3,
          }}
        />
      </span>
    </span>
  );
}

function SignalList({ signals }: { signals: SessionSignal[] }) {
  if (!signals.length) {
    return <span style={{ color: "#999" }}>No signals recorded</span>;
  }
  const sorted = [...signals].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {sorted.map((sig) => (
        <div
          key={sig.id}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              minWidth: 36,
              color: sig.delta > 0 ? "#5ba864" : sig.delta < 0 ? "#999" : "#777",
            }}
          >
            {sig.delta > 0 ? `+${sig.delta}` : sig.delta}
          </span>
          <span style={{ color: "#555" }}>{sig.label}</span>
          <span style={{ color: "#bbb", fontSize: 9, textTransform: "uppercase" }}>
            {sig.category}
          </span>
        </div>
      ))}
    </div>
  );
}

function KPI({ n, label }: { n: number; label: string }) {
  return (
    <div style={S.kpi}>
      <div style={S.kpiN}>{n.toLocaleString()}</div>
      <div style={S.kpiL}>{label}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>{title}</div>
      {children}
    </div>
  );
}

function Bars({ data }: { data: [string, number][] }) {
  if (!data.length) return <div style={{ color: "#ccc", fontSize: 11 }}>no data</div>;
  const max = Math.max(...data.map(([, c]) => c), 1);
  const total = data.reduce((s, [, c]) => s + c, 0) || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {data.map(([name, count]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 90,
              fontSize: 11,
              color: "#333",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {name}
          </span>
          <div
            style={{
              flex: 1,
              height: 7,
              background: "#f0ede8",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(count / max) * 100}%`,
                background: "#b43a24",
                borderRadius: 3,
                transition: "width 0.4s",
              }}
            />
          </div>
          <span
            style={{
              width: 28,
              fontSize: 11,
              fontWeight: 600,
              textAlign: "right",
              color: "#1a1815",
            }}
          >
            {count}
          </span>
          <span style={{ width: 32, fontSize: 10, color: "#999", textAlign: "right" }}>
            {Math.round((count / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function Timeline({ data, total }: { data: [string, number][]; total: number }) {
  if (!data?.length)
    return (
      <Card title="events over time">
        <p style={{ color: "#999", padding: 20, textAlign: "center" }}>no history yet</p>
      </Card>
    );

  const max = Math.max(...data.map(([, c]) => c), 1);
  const peak = data.reduce((a, b) => (b[1] > a[1] ? b : a), data[0]);
  const days = data.length;
  const avg = Math.round(total / days);
  // Label every Nth bar so the axis stays readable as history grows.
  const step = Math.max(1, Math.ceil(days / 16));

  return (
    <>
      <div style={S.kpis}>
        <KPI n={total} label="total events" />
        <KPI n={days} label="days tracked" />
        <KPI n={peak[1]} label="busiest day" />
        <KPI n={avg} label="avg / day" />
        <KPI n={data[data.length - 1][1]} label="latest day" />
      </div>

      <Card title="events per day — all time">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 160 }}>
          {data.map(([day, count], i) => (
            <div
              key={day}
              style={{
                flex: 1,
                minWidth: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <span style={{ fontSize: 8, color: "#bbb" }}>{count || ""}</span>
              <div
                style={{
                  width: "100%",
                  background: day === peak[0] ? "#e8b84a" : "#b43a24",
                  height: `${Math.max((count / max) * 100, 1)}%`,
                  borderRadius: 2,
                  transition: "height 0.3s",
                }}
                title={`${day}: ${count} events`}
              />
              <span
                style={{
                  fontSize: 8,
                  color: "#999",
                  whiteSpace: "nowrap",
                  transform: "rotate(-45deg)",
                  transformOrigin: "center",
                  height: 28,
                  width: 0,
                  textAlign: "center",
                }}
              >
                {i % step === 0 ? day.slice(5) : ""}
              </span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "#999", marginTop: 8 }}>
          busiest: {peak[0]} ({peak[1]} events) · {days} day{days === 1 ? "" : "s"} of history
        </p>
      </Card>
    </>
  );
}

function connTypeIcon(t: string) {
  return t === "company"
    ? "🏢"
    : t === "institution"
      ? "🎓"
      : t === "hosting"
        ? "☁️"
        : t === "mobile"
          ? "📱"
          : t === "individual"
            ? "🏠"
            : "•";
}

function evColor(e: string) {
  return e === "page_view"
    ? "#5ba864"
    : e === "terminal_query"
      ? "#3b82f6"
      : e === "project_click"
        ? "#e8b84a"
        : "#9b59b6";
}

const S: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 32px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: "#1a1815",
    background: "#faf9f6",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: "1px solid #e5e2dc",
  },
  h1: { fontSize: 18, fontWeight: 600, margin: 0, color: "#1a1815" },
  meta: { fontSize: 10, color: "#999", margin: "4px 0 0" },
  live: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 10,
    color: "#5ba864",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#5ba864",
    boxShadow: "0 0 4px #5ba864",
  },
  kpis: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 },
  kpi: {
    background: "#fff",
    border: "1px solid #e5e2dc",
    borderRadius: 6,
    padding: "16px 14px",
    textAlign: "center" as const,
  },
  kpiN: { fontSize: 28, fontWeight: 700, color: "#b43a24", lineHeight: 1 },
  kpiL: {
    fontSize: 9,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginTop: 4,
  },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 },
  card: {
    background: "#fff",
    border: "1px solid #e5e2dc",
    borderRadius: 6,
    padding: "14px 16px",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#999",
    marginBottom: 10,
  },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: {
    textAlign: "left" as const,
    padding: "6px 10px",
    borderBottom: "2px solid #e5e2dc",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: 9,
    color: "#999",
  },
  td: {
    padding: "5px 10px",
    borderBottom: "1px solid #f0ede8",
    whiteSpace: "nowrap" as const,
    fontSize: 11,
  },
  trAlt: { background: "#faf8f5" },
  badge: {
    display: "inline-block",
    padding: "2px 7px",
    borderRadius: 3,
    color: "#fff",
    fontSize: 9,
    fontWeight: 600,
  },
  tabs: { display: "flex", gap: 0, marginBottom: 16, borderBottom: "2px solid #e5e2dc" },
  tab: {
    border: "none",
    background: "transparent",
    padding: "8px 16px",
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    color: "#999",
    cursor: "pointer",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
    transition: "color 0.15s, border-color 0.15s",
  },
  tabActive: { color: "#b43a24", borderBottomColor: "#b43a24" },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: "1px solid #e5e2dc",
    fontSize: 10,
    color: "#999",
    textAlign: "center" as const,
  },
};

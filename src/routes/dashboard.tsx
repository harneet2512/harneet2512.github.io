import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard" }] }),
});

type Stats = {
  total: number;
  uniqueVisitors: number;
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
  terminalQueries: string[];
  projectClicks: [string, number][];
  recent: {
    event: string;
    source: string;
    location: string;
    device: string;
    browser: string;
    meta: Record<string, string>;
    ts: string;
  }[];
  since: string | null;
};

const TABS = ["overview", "live feed", "terminal", "traffic"] as const;
type Tab = (typeof TABS)[number];

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => { setIsMobile(window.innerWidth < 1024); }, []);

  useEffect(() => {
    const load = () =>
      fetch("/api/dashboard").then((r) => r.json()).then((d) => setStats(d as Stats)).catch(() => setError("failed"));
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (isMobile) return <div style={S.page}><p style={{ color: "#666", padding: 40 }}>desktop only</p></div>;
  if (error) return <div style={S.page}><p style={{ color: "#c00", padding: 40 }}>{error}</p></div>;
  if (!stats) return <div style={S.page}><p style={{ color: "#666", padding: 40 }}>loading...</p></div>;

  const pageViews = stats.eventTypes.find(([e]) => e === "page_view")?.[1] ?? 0;
  const queries = stats.eventTypes.find(([e]) => e === "terminal_query")?.[1] ?? 0;
  const clicks = stats.eventTypes.find(([e]) => e === "project_click")?.[1] ?? 0;

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div>
          <h1 style={S.h1}>workbench analytics</h1>
          <p style={S.meta}>
            in-memory · resets on deploy · since {stats.since ? new Date(stats.since).toLocaleString() : "—"} · auto-refresh 10s
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
        <KPI n={stats.uniqueVisitors} label="unique visitors" />
        <KPI n={pageViews} label="page views" />
        <KPI n={queries} label="terminal queries" />
        <KPI n={clicks} label="project clicks" />
      </div>

      {/* ── Overview tab ── */}
      {tab === "overview" && (
        <>
          <div style={S.grid3}>
            <Card title="traffic source"><Bars data={stats.sources} /></Card>
            <Card title="location"><Bars data={stats.locations} /></Card>
            <Card title="device"><Bars data={stats.devices} /></Card>
          </div>
          <div style={S.grid3}>
            <Card title="browser"><Bars data={stats.browsers} /></Card>
            <Card title="operating system"><Bars data={stats.oses} /></Card>
            <Card title="event type"><Bars data={stats.eventTypes} /></Card>
          </div>
          <Card title="hourly activity">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
              {stats.hourly.map(([hour, count]) => {
                const max = Math.max(...stats.hourly.map(([, c]) => c), 1);
                const pct = (count / max) * 100;
                return (
                  <div key={hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ width: "100%", background: count > 0 ? "#b43a24" : "#eee", height: `${Math.max(pct, 2)}%`, borderRadius: 2, transition: "height 0.3s" }} title={`${hour}: ${count}`} />
                    <span style={{ fontSize: 8, color: "#999" }}>{hour.replace(":00", "")}</span>
                  </div>
                );
              })}
            </div>
          </Card>
          {stats.projectClicks.length > 0 && (
            <Card title="project clicks"><Bars data={stats.projectClicks} /></Card>
          )}
        </>
      )}

      {/* ── Live Feed tab ── */}
      {tab === "live feed" && (
        <Card title="live event stream">
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {["time", "event", "source", "location", "device", "browser", "details"].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((e, i) => (
                  <tr key={i} style={i % 2 === 0 ? S.trAlt : undefined}>
                    <td style={S.td}>{new Date(e.ts).toLocaleTimeString()}</td>
                    <td style={S.td}><span style={{ ...S.badge, background: evColor(e.event) }}>{e.event.replace(/_/g, " ")}</span></td>
                    <td style={S.td}>{e.source}</td>
                    <td style={S.td}>{e.location}</td>
                    <td style={S.td}>{e.device}</td>
                    <td style={S.td}>{e.browser}</td>
                    <td style={{ ...S.td, color: "#999", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {Object.entries(e.meta).map(([k, v]) => `${k}: ${v}`).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
                {stats.recent.length === 0 && (
                  <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#999", padding: 40 }}>no events yet</td></tr>
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
              <p style={{ color: "#999", padding: 20, textAlign: "center" }}>no terminal queries yet</p>
            )}
          </Card>
          <Card title="project clicks — which projects get attention">
            {stats.projectClicks.length > 0 ? (
              <Bars data={stats.projectClicks} />
            ) : (
              <p style={{ color: "#999", padding: 20, textAlign: "center" }}>no project clicks yet</p>
            )}
          </Card>
        </>
      )}

      {/* ── Traffic tab ── */}
      {tab === "traffic" && (
        <>
          <div style={S.grid3}>
            <Card title="traffic source"><Bars data={stats.sources} /></Card>
            <Card title="location"><Bars data={stats.locations} /></Card>
            <Card title="device"><Bars data={stats.devices} /></Card>
          </div>
          <div style={S.grid3}>
            <Card title="timezone"><Bars data={stats.timezones} /></Card>
            <Card title="language"><Bars data={stats.languages} /></Card>
            <Card title="screen resolution"><Bars data={stats.screens} /></Card>
          </div>

          {/* Visitor table — each unique IP as a row */}
          <Card title="visitor sessions">
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["first seen", "source", "location", "device", "browser", "os", "language", "events"].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const seen = new Map<string, typeof stats.recent[0] & { count: number }>();
                    for (const e of [...stats.recent].reverse()) {
                      const key = `${e.source}-${e.device}-${e.browser}`;
                      if (!seen.has(key)) seen.set(key, { ...e, count: 1 });
                      else seen.get(key)!.count++;
                    }
                    return [...seen.values()].map((v, i) => (
                      <tr key={i} style={i % 2 === 0 ? S.trAlt : undefined}>
                        <td style={S.td}>{new Date(v.ts).toLocaleTimeString()}</td>
                        <td style={S.td}>{v.source}</td>
                        <td style={S.td}>{v.location}</td>
                        <td style={S.td}>{v.device}</td>
                        <td style={S.td}>{v.browser}</td>
                        <td style={{ ...S.td, color: "#999" }}>—</td>
                        <td style={{ ...S.td, color: "#999" }}>—</td>
                        <td style={{ ...S.td, fontWeight: 600 }}>{v.count}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <footer style={S.footer}>
        {stats.total} events · {stats.uniqueVisitors} unique · since {stats.since ? new Date(stats.since).toLocaleString() : "—"}
      </footer>
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
          <span style={{ width: 90, fontSize: 11, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{name}</span>
          <div style={{ flex: 1, height: 7, background: "#f0ede8", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(count / max) * 100}%`, background: "#b43a24", borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          <span style={{ width: 28, fontSize: 11, fontWeight: 600, textAlign: "right", color: "#1a1815" }}>{count}</span>
          <span style={{ width: 32, fontSize: 10, color: "#999", textAlign: "right" }}>{Math.round((count / total) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

function evColor(e: string) {
  return e === "page_view" ? "#5ba864" : e === "terminal_query" ? "#3b82f6" : e === "project_click" ? "#e8b84a" : "#9b59b6";
}

const S: Record<string, CSSProperties> = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "24px 32px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#1a1815", background: "#faf9f6", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #e5e2dc" },
  h1: { fontSize: 18, fontWeight: 600, margin: 0, color: "#1a1815" },
  meta: { fontSize: 10, color: "#999", margin: "4px 0 0" },
  live: { display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#5ba864", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "#5ba864", boxShadow: "0 0 4px #5ba864" },
  kpis: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 },
  kpi: { background: "#fff", border: "1px solid #e5e2dc", borderRadius: 6, padding: "16px 14px", textAlign: "center" as const },
  kpiN: { fontSize: 28, fontWeight: 700, color: "#b43a24", lineHeight: 1 },
  kpiL: { fontSize: 9, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 },
  card: { background: "#fff", border: "1px solid #e5e2dc", borderRadius: 6, padding: "14px 16px", marginBottom: 12 },
  cardTitle: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", marginBottom: 10 },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, padding: "6px 10px", borderBottom: "2px solid #e5e2dc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 9, color: "#999" },
  td: { padding: "5px 10px", borderBottom: "1px solid #f0ede8", whiteSpace: "nowrap" as const, fontSize: 11 },
  trAlt: { background: "#faf8f5" },
  badge: { display: "inline-block", padding: "2px 7px", borderRadius: 3, color: "#fff", fontSize: 9, fontWeight: 600 },
  tabs: { display: "flex", gap: 0, marginBottom: 16, borderBottom: "2px solid #e5e2dc" },
  tab: { border: "none", background: "transparent", padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: "#999", cursor: "pointer", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "2px solid transparent", marginBottom: -2, transition: "color 0.15s, border-color 0.15s" },
  tabActive: { color: "#b43a24", borderBottomColor: "#b43a24" },
  footer: { marginTop: 16, paddingTop: 12, borderTop: "1px solid #e5e2dc", fontSize: 10, color: "#999", textAlign: "center" as const },
};

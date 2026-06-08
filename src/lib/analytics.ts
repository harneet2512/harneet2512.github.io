/**
 * Client-side product analytics — a small, dependency-free PostHog-style layer.
 *
 * It enriches every event with session + device identity, referrer/UTM, and
 * viewport, and adds automatic capture on top of explicit events:
 *   - session_start / page_view / page_leave (with engaged time + scroll depth)
 *   - autocapture clicks (element label, tag, href) with no per-element wiring
 *   - rage clicks (rapid repeated clicks in the same spot)
 *   - dead clicks (clicks that hit nothing interactive)
 *
 * It is purely behavioural instrumentation: it never changes the DOM, styles, or
 * layout, so it cannot affect the site visually. All browser access is guarded
 * for SSR/prerender.
 */
import { apiUrl } from "./api";

type Primitive = string | number | boolean | undefined | null;
type Props = Record<string, Primitive>;

const SID_KEY = "hb_sid"; // session id — sessionStorage, new per tab session
const DID_KEY = "hb_did"; // device id — localStorage, persists across sessions
const SEEN_KEY = "harneet-boot-seen"; // reuse the boot flag as "returning visitor"

const isBrowser = typeof window !== "undefined";

function uid(): string {
  try {
    if (isBrowser && crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

function getSession(): string {
  if (!isBrowser) return "";
  try {
    let s = sessionStorage.getItem(SID_KEY);
    if (!s) {
      s = uid();
      sessionStorage.setItem(SID_KEY, s);
    }
    return s;
  } catch {
    return "";
  }
}

function getDevice(): string {
  if (!isBrowser) return "";
  try {
    let d = localStorage.getItem(DID_KEY);
    if (!d) {
      d = uid();
      localStorage.setItem(DID_KEY, d);
    }
    return d;
  } catch {
    return "";
  }
}

function utmParams(): Props {
  if (!isBrowser) return {};
  const p = new URLSearchParams(window.location.search);
  const out: Props = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"]) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 60);
  }
  return out;
}

// ── Per-page engagement + scroll state ────────────────────────────────────────
let pagePath = isBrowser ? window.location.pathname : "/";
let pageEnteredAt = 0;
let engagedMs = 0; // accumulated *visible* time on the current page
let lastResume = 0;
let maxScrollPct = 0;

function now(): number {
  return isBrowser && window.performance ? performance.now() : Date.now();
}

function resumeEngagement() {
  lastResume = now();
}
function pauseEngagement() {
  if (lastResume) {
    engagedMs += now() - lastResume;
    lastResume = 0;
  }
}

function currentScrollPct(): number {
  if (!isBrowser) return 0;
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100; // non-scrolling page (the felt-os desktop) = fully seen
  return Math.min(100, Math.round((window.scrollY / scrollable) * 100));
}

// ── Transport ────────────────────────────────────────────────────────────────
function enrich(props?: Props): Record<string, string> {
  const meta: Record<string, string> = {};
  const base: Props = {
    path: pagePath,
    referrer: isBrowser ? document.referrer || "direct" : "direct",
    viewport: isBrowser ? `${window.innerWidth}x${window.innerHeight}` : "",
    returning: (() => {
      try {
        return isBrowser && sessionStorage.getItem(SEEN_KEY) === "1" ? "yes" : "no";
      } catch {
        return "no";
      }
    })(),
    ...utmParams(),
    ...props,
  };
  for (const [k, v] of Object.entries(base)) {
    if (v === undefined || v === null || v === "") continue;
    meta[k] = String(v).slice(0, 200);
  }
  return meta;
}

type Payload = {
  event: string;
  meta: Record<string, string>;
  sid: string;
  did: string;
  durationMs?: number;
  scrollPct?: number;
  label?: string;
  screen?: string;
  lang?: string;
  tz?: string;
};

function send(payload: Payload, beacon = false) {
  if (!isBrowser) return;
  const url = apiUrl("/api/track");
  const body = JSON.stringify(payload);
  try {
    // text/plain keeps cross-origin beacons/posts in the CORS "simple request"
    // lane (no preflight) — the server JSON-parses the body regardless.
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
      return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let instrumentation throw into the app */
  }
}

/** Fire an explicit event with enrichment. */
export function track(event: string, props?: Props, opts?: { label?: string; beacon?: boolean }) {
  if (!isBrowser) return;
  send(
    {
      event,
      meta: enrich(props),
      sid: getSession(),
      did: getDevice(),
      label: opts?.label,
      screen: `${window.screen.width}x${window.screen.height}`,
      lang: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    opts?.beacon,
  );
}

// ── Page lifecycle ─────────────────────────────────────────────────────────────
let leftCurrentPage = false; // dedupe: at most one page_leave per page view

function flushPageLeave(beacon = true) {
  if (!isBrowser || !pageEnteredAt || leftCurrentPage) return;
  leftCurrentPage = true;
  pauseEngagement();
  send(
    {
      event: "page_leave",
      meta: enrich({ path: pagePath }),
      sid: getSession(),
      did: getDevice(),
      durationMs: Math.round(engagedMs),
      scrollPct: maxScrollPct,
    },
    beacon,
  );
}

/** Record a navigation to a new route (call on every pathname change). */
export function trackPageview(path: string) {
  if (!isBrowser) return;
  if (pageEnteredAt && path !== pagePath) flushPageLeave(false); // close the prior page
  pagePath = path;
  pageEnteredAt = now();
  engagedMs = 0;
  maxScrollPct = currentScrollPct();
  leftCurrentPage = false;
  resumeEngagement();
  track("page_view", { path });
}

// ── Autocapture: clicks, rage clicks, dead clicks ──────────────────────────────
const INTERACTIVE = "a,button,[role=button],[data-track],input,select,textarea,summary,label";

function labelFor(el: Element): string {
  const explicit = el.getAttribute("data-track");
  if (explicit) return explicit;
  const aria = el.getAttribute("aria-label") || el.getAttribute("title");
  if (aria) return aria.slice(0, 60);
  const text = (el as HTMLElement).innerText || el.textContent || "";
  const t = text.replace(/\s+/g, " ").trim();
  if (t) return t.slice(0, 60);
  const cls = (el.getAttribute("class") || "").split(" ")[0];
  return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
}

let lastClick = { t: 0, x: 0, y: 0, n: 0, label: "" };

function onClick(e: MouseEvent) {
  if (!isBrowser) return;
  const target = e.target as Element | null;
  if (!target) return;
  const el = target.closest(INTERACTIVE);

  // Rage detection: 3+ clicks within 700ms inside a ~28px radius.
  const t = now();
  const within =
    t - lastClick.t < 700 && Math.hypot(e.clientX - lastClick.x, e.clientY - lastClick.y) < 28;
  lastClick = within
    ? {
        t,
        x: e.clientX,
        y: e.clientY,
        n: lastClick.n + 1,
        label: el ? labelFor(el) : lastClick.label,
      }
    : { t, x: e.clientX, y: e.clientY, n: 1, label: el ? labelFor(el) : "" };
  if (lastClick.n === 3) {
    track("rage_click", { label: lastClick.label || "(none)", path: pagePath });
  }

  if (!el) {
    // Dead click — landed on nothing interactive.
    track("dead_click", { region: labelFor(target).slice(0, 40) });
    return;
  }

  const label = labelFor(el);
  const href = el.getAttribute("href") || undefined;
  const isExternal = !!href && /^https?:\/\//.test(href) && !href.includes(location.host);
  track(
    "click",
    {
      label,
      tag: el.tagName.toLowerCase(),
      href: href?.slice(0, 120),
      external: isExternal ? "yes" : undefined,
    },
    { label },
  );
}

function onScroll() {
  const pct = currentScrollPct();
  if (pct > maxScrollPct) maxScrollPct = pct;
}

function onVisibility() {
  if (document.visibilityState === "hidden") {
    flushPageLeave(true);
  } else {
    // Returned to the page — re-arm a future leave and resume the dwell timer.
    leftCurrentPage = false;
    resumeEngagement();
  }
}

let started = false;

/** Wire up autocapture + lifecycle once. Safe to call multiple times. */
export function initAnalytics() {
  if (!isBrowser || started) return;
  started = true;

  pageEnteredAt = now();
  resumeEngagement();
  maxScrollPct = currentScrollPct();

  // session_start once per tab session
  try {
    if (!sessionStorage.getItem("hb_session_started")) {
      sessionStorage.setItem("hb_session_started", "1");
      track("session_start", { entry: pagePath });
    }
  } catch {
    /* ignore */
  }

  document.addEventListener("click", onClick, { capture: true, passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", () => flushPageLeave(true));
}

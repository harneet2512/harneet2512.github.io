import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

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
};

const MAX_EVENTS = 5000;
const FILE = join(process.cwd(), ".analytics.json");

let events: Event[] = [];
let dirty = false;

// Load from disk on startup
try {
  if (existsSync(FILE)) {
    events = JSON.parse(readFileSync(FILE, "utf-8")) as Event[];
  }
} catch {
  events = [];
}

function flush() {
  if (!dirty) return;
  try {
    writeFileSync(FILE, JSON.stringify(events), "utf-8");
    dirty = false;
  } catch {
    /* serverless: no writable fs, fall back to in-memory only */
  }
}

// Flush every 5 seconds
setInterval(flush, 5000);

export function record(e: Event) {
  events.push(e);
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
  dirty = true;
}

export function getStats() {
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

  for (const e of events) {
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
    total: events.length,
    uniqueVisitors: uniqueIps.size,
    sources: sorted(sources),
    locations: sorted(countries),
    devices: sorted(devices),
    browsers: sorted(browsers),
    oses: sorted(oses),
    eventTypes: sorted(eventTypes),
    screens: sorted(screens),
    timezones: sorted(timezones),
    languages: sorted(languages),
    hourly: Array.from({ length: 24 }, (_, i) => [String(i).padStart(2, "0") + ":00", hourly[i] || 0] as [string, number]),
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
    recent: events.slice(-50).reverse().map((e) => ({
      event: e.event,
      source: e.source,
      location: [e.city, e.country].filter(Boolean).join(", ") || "unknown",
      device: e.device,
      browser: e.browser,
      meta: e.meta,
      ts: e.ts,
    })),
    since: events[0]?.ts || null,
  };
}

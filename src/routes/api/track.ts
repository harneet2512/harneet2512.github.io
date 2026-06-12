import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { record } from "@/lib/analytics-store";
import {
  classifyPageReferrer,
  classifySiteOrigin,
  isBotUA,
  isPortfolioHost,
} from "@/lib/analytics-classify";
import { lookupIp } from "@/lib/ip-intel";
import { corsJson, preflight, withCors } from "@/lib/cors";

function parseUA(ua: string) {
  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  let browser = "unknown";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua)) browser = "Safari";

  let os = "unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";

  return { mobile, browser, os };
}

// A *real* visitor only reaches /api/track by executing our client-side JS.
// UA-based crawlers are flagged; datacenter bounces are classified later at session rollup.

export const Route = createFileRoute("/api/track")({
  server: {
    handlers: {
      OPTIONS: ({ request }: { request: Request }) => preflight(request),
      POST: async ({ request }: { request: Request }) => {
        let body: {
          event?: string;
          meta?: Record<string, string>;
          screen?: string;
          lang?: string;
          tz?: string;
          sid?: string; // session id
          did?: string; // device id
          durationMs?: number; // page_leave engaged time
          scrollPct?: number; // page_leave max scroll depth
          label?: string; // autocapture click label
        };
        try {
          // Body is sent as text/plain (to keep cross-origin beacons preflight-free);
          // request.json() still parses it since the body is JSON text.
          body = (await request.json()) as typeof body;
        } catch {
          return withCors(new Response("bad request", { status: 400 }), request);
        }

        const event = body.event;
        if (!event || typeof event !== "string") {
          return withCors(new Response("missing event", { status: 400 }), request);
        }

        // Always record for the dashboard; the Discord ping is best-effort on top.
        const webhook = process.env.DISCORD_WEBHOOK_URL;

        const ts = new Date().toISOString();
        let ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("x-real-ip") ??
          request.headers.get("cf-connecting-ip") ??
          "unknown";

        // Local-dev helper: real visitor IPs only exist on the deployed backend.
        // Pass ?testip=8.8.8.8 to exercise the company classifier from localhost.
        const testip = new URL(request.url).searchParams.get("testip");
        if (testip) ip = testip;

        const ua = request.headers.get("user-agent") ?? "unknown";
        const ref = request.headers.get("referer") ?? "direct";
        const acceptLang = request.headers.get("accept-language")?.split(",")[0] ?? "";
        const meta = body.meta ?? {};

        const { mobile, browser, os } = parseUA(ua);
        const bot = isBotUA(ua);

        // Page referrer = how the visitor found the site (from client meta).
        // HTTP Referer on this API call is usually github.io / vercel — site origin, not attribution.
        const pageRef = meta.referrer || "";
        const httpHost = ref !== "direct" ? ref.replace(/https?:\/\//, "").split("/")[0] : "";
        const source = classifyPageReferrer(
          pageRef && pageRef !== "direct"
            ? pageRef
            : httpHost && !isPortfolioHost(httpHost)
              ? ref
              : "direct",
        );
        const siteOrigin = ref !== "direct" ? classifySiteOrigin(ref) : "unknown";
        const enrichedMeta = { ...meta, site_origin: siteOrigin };

        // Reverse-IP: geo + network owner (company/university vs ISP/mobile/VPN).
        // Vercel's own geo headers only give country/city, never the org, so this
        // single ip-api call also repairs the previously-empty location.
        const intel = await lookupIp(ip);
        const country = intel.country || (request.headers.get("x-vercel-ip-country") ?? "");
        const city = intel.city || (request.headers.get("x-vercel-ip-city") ?? "");
        const loc = [city, country].filter(Boolean).join(", ") || "unknown";

        await record({
          event,
          ip,
          source,
          country,
          city,
          device: mobile ? "mobile" : "desktop",
          os,
          browser,
          lang: acceptLang || body.lang || "",
          tz: body.tz || "",
          screen: body.screen || "",
          meta: enrichedMeta,
          ts: ts,
          org: intel.label,
          asn: intel.asn,
          connType: intel.connType,
          region: intel.region,
          ua: ua.slice(0, 400),
          bot,
          sessionId: body.sid || "",
          deviceId: body.did || "",
          durationMs: typeof body.durationMs === "number" ? body.durationMs : undefined,
          scrollPct: typeof body.scrollPct === "number" ? body.scrollPct : undefined,
          label: body.label || meta.label || "",
        });

        if (webhook) {
          const fields = Object.entries(meta)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ");

          // Company / university hits are the high-signal pings — gold for a
          // company, purple for a university, and the org name leads the title.
          const orgIcon = intel.connType === "institution" ? "🎓" : "🏢";
          const orgColor = intel.connType === "institution" ? 0x9b59b6 : 0xe8b84a;
          const baseColor =
            event === "page_view"
              ? 0x5ba864
              : event === "terminal_query"
                ? 0x3b82f6
                : event === "project_click"
                  ? 0xe8b84a
                  : 0x9b59b6;
          const embedColor = intel.isOrg ? orgColor : baseColor;
          const title = intel.isOrg
            ? `${orgIcon} ${intel.label} · ${event.replace(/_/g, " ")}`
            : event.replace(/_/g, " ");

          // Human-readable network label for the individual case.
          const netLabel =
            intel.connType === "mobile"
              ? `📱 ${intel.label || "mobile carrier"}`
              : intel.connType === "hosting"
                ? `🛡️ ${intel.label || "VPN / datacenter"}`
                : intel.label || "unknown network";

          const embedFields = [
            intel.isOrg
              ? {
                  name: "Company",
                  value: `${intel.label}${intel.asn ? ` (${intel.asn})` : ""}`,
                  inline: false,
                }
              : { name: "Network", value: netLabel, inline: true },
            { name: "Source", value: source, inline: true },
            { name: "Location", value: loc, inline: true },
            { name: "Device", value: `${mobile ? "Mobile" : "Desktop"} · ${os}`, inline: true },
            { name: "Browser", value: browser, inline: true },
            { name: "Timezone", value: body.tz || "?", inline: true },
          ];

          if (fields) {
            embedFields.push({ name: "Details", value: fields, inline: false });
          }

          try {
            await fetch(webhook, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                embeds: [
                  {
                    title,
                    color: embedColor,
                    fields: embedFields,
                    footer: { text: `${ip} · ${ts}` },
                  },
                ],
              }),
            });
          } catch {
            /* fire and forget */
          }
        }

        return corsJson({ ok: true }, request);
      },
    },
  },
});

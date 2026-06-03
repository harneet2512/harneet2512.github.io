import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { record } from "@/lib/analytics-store";
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

function classifySource(ref: string): string {
  if (!ref || ref === "direct") return "direct";
  const host = ref.replace(/https?:\/\//, "").split("/")[0].toLowerCase();
  if (host.includes("linkedin")) return "LinkedIn";
  if (host.includes("google")) return "Google";
  if (host.includes("github")) return "GitHub";
  if (host.includes("twitter") || host.includes("x.com")) return "X/Twitter";
  if (host.includes("reddit")) return "Reddit";
  if (host.includes("bing")) return "Bing";
  if (host.includes("t.co")) return "X/Twitter";
  return host;
}

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
        };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return withCors(new Response("bad request", { status: 400 }), request);
        }

        const event = body.event;
        if (!event || typeof event !== "string") {
          return withCors(new Response("missing event", { status: 400 }), request);
        }

        const webhook = process.env.DISCORD_WEBHOOK_URL;
        if (!webhook) return corsJson({ ok: true }, request);

        const ts = new Date().toISOString();
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("x-real-ip") ??
          request.headers.get("cf-connecting-ip") ??
          "unknown";
        const country = request.headers.get("cf-ipcountry") ?? "";
        const city = request.headers.get("cf-ipcity") ?? "";
        const ua = request.headers.get("user-agent") ?? "unknown";
        const ref = request.headers.get("referer") ?? "direct";
        const acceptLang = request.headers.get("accept-language")?.split(",")[0] ?? "";
        const meta = body.meta ?? {};

        const { mobile, browser, os } = parseUA(ua);
        const source = classifySource(ref);
        const loc = [city, country].filter(Boolean).join(", ") || "unknown";

        record({
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
          meta,
          ts: ts,
        });

        const fields = Object.entries(meta)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" · ");

        const embedColor =
          event === "page_view"
            ? 0x5ba864
            : event === "terminal_query"
              ? 0x3b82f6
              : event === "project_click"
                ? 0xe8b84a
                : 0x9b59b6;

        const embedFields = [
          { name: "Source", value: source, inline: true },
          { name: "Location", value: loc, inline: true },
          { name: "Device", value: `${mobile ? "Mobile" : "Desktop"} · ${os}`, inline: true },
          { name: "Browser", value: browser, inline: true },
          { name: "Language", value: acceptLang || body.lang || "?", inline: true },
          { name: "Timezone", value: body.tz || "?", inline: true },
        ];

        if (body.screen) {
          embedFields.push({ name: "Screen", value: body.screen, inline: true });
        }

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
                  title: event.replace(/_/g, " "),
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

        return corsJson({ ok: true }, request);
      },
    },
  },
});

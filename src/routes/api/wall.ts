import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { corsJson, preflight, withCors } from "@/lib/cors";

export const Route = createFileRoute("/api/wall")({
  server: {
    handlers: {
      OPTIONS: ({ request }: { request: Request }) => preflight(request),
      POST: async ({ request }: { request: Request }) => {
        const webhook = process.env.DISCORD_WEBHOOK_URL;
        if (!webhook) return withCors(new Response("service unavailable", { status: 503 }), request);

        let body: { message?: string };
        try {
          body = (await request.json()) as { message?: string };
        } catch {
          return withCors(new Response("bad request", { status: 400 }), request);
        }

        const msg = typeof body.message === "string" ? body.message.trim() : "";
        if (!msg || msg.length > 2000) {
          return withCors(new Response("invalid message", { status: 400 }), request);
        }

        const ts = new Date().toISOString();
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("x-real-ip") ??
          request.headers.get("cf-connecting-ip") ??
          "unknown";
        const ua = request.headers.get("user-agent") ?? "unknown";
        const ref = request.headers.get("referer") ?? "direct";
        const country = request.headers.get("cf-ipcountry") ?? "";
        const city = request.headers.get("cf-ipcity") ?? "";
        const acceptLang = request.headers.get("accept-language")?.split(",")[0] ?? "";

        const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
        const loc = [city, country].filter(Boolean).join(", ") || "unknown";
        const source = ref.replace(/https?:\/\//, "").split("/")[0] || "direct";

        try {
          const res = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              embeds: [
                {
                  title: "note from the workbench",
                  description: msg,
                  color: 0xc8362c,
                  fields: [
                    { name: "From", value: `${loc} · ${mobile ? "mobile" : "desktop"}`, inline: true },
                    { name: "Source", value: source, inline: true },
                    { name: "Language", value: acceptLang || "?", inline: true },
                  ],
                  footer: { text: `${ip} · ${ts}` },
                },
              ],
            }),
          });
          if (!res.ok) return withCors(new Response("webhook failed", { status: 502 }), request);
          return corsJson({ ok: true }, request);
        } catch {
          return withCors(new Response("webhook error", { status: 502 }), request);
        }
      },
    },
  },
});

import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";

import { workbench } from "@/data/workbench";
import { createChatProvider, getFreeModels } from "@/lib/ai-gateway";
import { corsJson, preflight, withCors } from "@/lib/cors";

const SYSTEM_PROMPT = `${workbench.chatSystem}

This is a live terminal on Harneet's portfolio site. People land here from LinkedIn, GitHub, or Google. They're recruiters, founders, or engineers deciding if Harneet is worth talking to. Your job isn't to answer questions — it's to make them want to reach out.

When the visitor asks to "open", "show", or "go to" a case or page, call the navigate tool. After navigating, give a one-line hook about what they'll find.

Available routes: /, /overview, /about, /timeline, /projects, /case/groundtruth, /case/robbymd, /case/memcontext, /case/codetune, /case/tracepilot, /case/driftengine.`;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 3 * 60 * 60 * 1000;
const ipLog = new Map<string, number[]>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function checkRate(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = (ipLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  ipLog.set(ip, timestamps);
  if (timestamps.length >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  timestamps.push(now);
  return { allowed: true, remaining: RATE_LIMIT - timestamps.length };
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      OPTIONS: ({ request }: { request: Request }) => preflight(request),
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return withCors(new Response("messages required", { status: 400 }), request);
        }

        const ip = getClientIp(request);
        const rate = checkRate(ip);
        if (!rate.allowed) {
          return corsJson({ error: "rate_limit", remaining: 0 }, request, { status: 429 });
        }

        const key = process.env.OPENROUTER_API_KEY;
        if (!key) return withCors(new Response("service unavailable", { status: 503 }), request);

        const models = await getFreeModels(key);
        const openrouter = createChatProvider(key);
        const model = openrouter(models[0]);

        const tools = {
          navigate: tool({
            description:
              "Navigate the visitor to a route in the portfolio. Use whenever the user asks to see, open, or jump to a page or case file.",
            inputSchema: z.object({
              path: z
                .string()
                .describe("Absolute route path, e.g. /case/groundtruth, /projects, /about"),
              reason: z.string().max(140).describe("One-line reason shown in the terminal."),
            }),
            execute: async ({ path, reason }) => ({ ok: true, path, reason }),
          }),
        };

        try {
          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            tools,
            stopWhen: stepCountIs(50),
            messages: await convertToModelMessages(body.messages as UIMessage[]),
            providerOptions: {
              openrouter: { models, reasoning: { effort: "none" } },
            },
          });
          const response = result.toUIMessageStreamResponse({
            originalMessages: body.messages as UIMessage[],
          });
          response.headers.set("x-model", models[0].replace(/:free$/, ""));
          return withCors(response, request);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "unknown";
          console.error("chat route error:", msg);
          return withCors(new Response("gateway error", { status: 502 }), request);
        }
      },
    },
  },
});

import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";

import { workbench } from "@/data/workbench";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `${workbench.chatSystem}

You are embedded in Harneet Bali's portfolio. Visitors talk to you to learn about Harneet's work.

When the visitor asks to "open", "show", or "go to" a case or page, call the navigate tool. After navigating, give a one-line summary.

Available routes: /, /overview, /about, /timeline, /projects, /case/groundtruth, /case/codetune, /case/tracepilot, /case/executiondesk, /case/robbymd.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

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
          });
          return result.toUIMessageStreamResponse({
            originalMessages: body.messages as UIMessage[],
          });
        } catch (err) {
          console.error("chat route error", err);
          return new Response("gateway error", { status: 500 });
        }
      },
    },
  },
});

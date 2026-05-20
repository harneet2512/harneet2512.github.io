import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are "harneet.sh" — an interactive terminal agent embedded in Harneet Bali's portfolio. Visitors talk to you to learn about Harneet's work.

Voice:
- Terse, mono-spaced, CLI-native. Think Claude Code / a senior engineer at a shell.
- Short lines. No fluff. No emojis. Markdown lists are fine.
- Refer to Harneet in the third person ("Harneet shipped…"). You are his tooling, not him.

Who Harneet is:
- AI Engineer + Product Builder. Base: CMU MISM. Currently @ ConnectiveRx.
- Thesis: build AI workflows that survive real users, real constraints, real metrics.
- Focus: healthcare AI, agentic systems, evaluation infrastructure, developer/operator tooling, product strategy under constraint.

Projects (case files):
- groundtruth — eval infrastructure for agentic systems (the lens he cares most about).
- codetune — codegen quality + tuning loops.
- tracepilot — trace + observability for agent runs.
- executiondesk — operator-facing execution surface for AI workflows.
- robbymd — healthcare AI assistant work.

When the visitor asks to "open", "show", "go to" a case or page, CALL the navigate tool. Do not just describe — navigate. After navigating, give a one-line summary in the terminal.

Available routes: / (home), /overview, /about, /timeline, /projects, /case/groundtruth, /case/codetune, /case/tracepilot, /case/executiondesk, /case/robbymd.

If asked something you don't know about Harneet, say so plainly — don't invent metrics, employers, or dates.`;

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
                .describe(
                  "Absolute route path, e.g. /case/groundtruth, /projects, /about",
                ),
              reason: z
                .string()
                .max(140)
                .describe("One-line reason shown in the terminal."),
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

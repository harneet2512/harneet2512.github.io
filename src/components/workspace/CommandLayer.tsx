import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";

import { ChipMono } from "@/components/ui/primitives/ChipMono";
import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { StatusDot } from "@/components/ui/primitives/StatusDot";
import { cn } from "@/lib/utils";

const TABS = ["Command", "Activity", "Context", "Ask"] as const;

const SUGGESTIONS = [
  "/why-hire",
  "/open groundtruth",
  "/open codetune",
  "/open tracepilot",
  "/show evidence",
  "/compare ai-engineer pm",
  "/show product work",
  "/show engineering work",
  "/resume summary",
  "/best projects",
];

const ACTIVITY = [
  { text: "GroundTruth case indexed", time: "now", kind: "case" },
  { text: "Project evidence available", time: "1m", kind: "evidence" },
  { text: "Builder context mounted", time: "2m", kind: "context" },
  { text: "Command layer ready", time: "3m", kind: "system" },
  { text: "Workspace initialized", time: "4m", kind: "system" },
];

const EMPTY_TRANSCRIPT = [
  "Harneet workbench ready.",
  "5 case files indexed: GroundTruth, CodeTune, TracePilot, ExecutionDesk AI, RobbyMD.",
  "Ask a question or run a slash command to inspect proof, fit, or project evidence.",
];

export function CommandLayer() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Command");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigatedIds = useRef(new Set<string>());

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    for (const m of messages) {
      for (const part of m.parts) {
        const p = part as unknown as {
          type: string;
          toolCallId?: string;
          state?: string;
          output?: { path?: string };
        };
        if (
          p.type === "tool-navigate" &&
          p.state === "output-available" &&
          p.output?.path &&
          p.toolCallId &&
          !navigatedIds.current.has(p.toolCallId)
        ) {
          navigatedIds.current.add(p.toolCallId);
          navigate({ to: p.output.path }).catch(() => {});
        }
      }
    }
  }, [messages, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = messages.length === 0 ? 0 : scrollRef.current.scrollHeight;
    }
  }, [messages, status, activeTab]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function submit(text: string) {
    const t = text.trim();
    if (!t || isBusy) return;
    setActiveTab("Ask");
    sendMessage({ text: t });
    setInput("");
  }

  return (
    <section
      aria-label="Command terminal"
      className="flex h-full min-h-0 flex-col border-t border-border-line bg-surface-inset"
    >
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border-hair bg-surface-base/45 px-3 md:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-tertiary">
            Terminal
          </span>
          <span className="hidden h-3 w-px bg-border-line md:block" aria-hidden />
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative h-9 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
                  active ? "text-foreground" : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {tab}
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-sage" aria-hidden />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 font-mono text-[10.5px] text-text-tertiary sm:flex">
          <span className="flex items-center gap-1.5">
            <StatusDot tone={isBusy ? "warn" : "sage"} />
            {isBusy ? "running" : "ready"}
          </span>
          <span>harneet-agent</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,0.65fr)_minmax(260px,0.35fr)]">
        <div className="flex min-h-0 flex-col border-r-0 border-border-hair md:border-r">
          <div className="min-h-0 flex-1 px-3 py-3 md:px-4">
            <CommandTranscript
              activeTab={activeTab}
              messages={messages}
              status={status}
              error={error}
              scrollRef={scrollRef}
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="shrink-0 border-t border-border-hair bg-surface-inset px-3 py-3 md:px-4"
          >
            <div className="flex min-h-10 items-center gap-2 rounded-row border border-border-line bg-surface-card px-3 transition-colors focus-within:border-border-strong">
              <span className="shrink-0 font-mono text-[12px] text-sage">hb</span>
              <span className="shrink-0 font-mono text-[12px] text-text-tertiary">/</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isBusy}
                placeholder="Ask about Harneet or run a command..."
                className="h-10 min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-foreground placeholder:text-text-tertiary/70 focus:outline-none disabled:opacity-50"
              />
              {isBusy ? (
                <span className="h-3 w-px animate-pulse bg-sage" aria-hidden />
              ) : (
                <button
                  type="submit"
                  className="rounded-chip px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary transition-colors hover:text-sage disabled:opacity-50"
                  disabled={!input.trim()}
                >
                  Enter
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="hidden min-h-0 flex-col bg-surface-base/25 md:flex">
          <TerminalSidecar activeTab={activeTab} onCommand={submit} />
        </div>
      </div>
    </section>
  );
}

function TerminalSidecar({
  activeTab,
  onCommand,
}: {
  activeTab: (typeof TABS)[number];
  onCommand: (command: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 px-4 py-3">
      <div>
        <Eyebrow>{activeTab === "Context" ? "Workspace Context" : "Suggested Commands"}</Eyebrow>
        <div className="mt-2 flex max-h-24 flex-wrap gap-1.5 overflow-hidden">
          {SUGGESTIONS.map((s) => (
            <ChipMono key={s} onClick={() => onCommand(s)}>
              {s}
            </ChipMono>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 border-t border-border-hair pt-4">
        <Eyebrow>Recent Activity</Eyebrow>
        <div className="mt-3 flex flex-col gap-2.5">
          {ACTIVITY.map((item) => (
            <div
              key={item.text}
              className="grid grid-cols-[52px_minmax(0,1fr)] gap-2 font-mono text-[11px]"
            >
              <span className="text-text-tertiary">{item.time}</span>
              <span className="truncate text-text-secondary">
                <span className="text-sage">[{item.kind}]</span> {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border-hair pt-3">
        <div className="glitch-wordmark terminal-wordmark" data-text="HARNEET">
          HARNEET
        </div>
      </div>
    </div>
  );
}

function CommandTranscript({
  activeTab,
  messages,
  status,
  error,
  scrollRef,
}: {
  activeTab: (typeof TABS)[number];
  messages: ReturnType<typeof useChat>["messages"];
  status: ReturnType<typeof useChat>["status"];
  error: ReturnType<typeof useChat>["error"];
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow>{activeTab === "Ask" ? "Output" : activeTab}</Eyebrow>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
          personal-ai-workbench
        </span>
      </div>
      <div ref={scrollRef} className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 font-mono">
        {messages.length === 0 && (
          <div className="space-y-1.5">
            {EMPTY_TRANSCRIPT.map((line, index) => (
              <TerminalLine key={line} prefix={index === 0 ? "system" : "index"}>
                {line}
              </TerminalLine>
            ))}
            <TerminalLine prefix="hint">
              Start with /why-hire, /best projects, or /open groundtruth.
            </TerminalLine>
          </div>
        )}

        {messages.map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}

        {isBusy && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-text-tertiary">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
            reading workspace context
          </div>
        )}

        {error && (
          <div className="mt-3 text-[12px] text-warn">
            Connection unavailable - try again or browse manually.
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalLine({ prefix, children }: { prefix: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[68px_minmax(0,1fr)] gap-3 text-[12px] leading-relaxed">
      <span className="text-text-tertiary">{prefix}</span>
      <span className="text-text-secondary">{children}</span>
    </div>
  );
}

function MessageRow({ message }: { message: ReturnType<typeof useChat>["messages"][number] }) {
  const isUser = message.role === "user";
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  const toolParts = message.parts.filter((p) => p.type.startsWith("tool-")) as Array<{
    type: string;
    state?: string;
    output?: { path?: string; reason?: string };
  }>;

  return (
    <div className="mt-3">
      {isUser ? (
        <div className="grid grid-cols-[68px_minmax(0,1fr)] gap-3 text-[12px] leading-relaxed">
          <span className="text-sage">you</span>
          <span className="text-foreground">{text}</span>
        </div>
      ) : (
        <div className="grid grid-cols-[68px_minmax(0,1fr)] gap-3">
          <span className="font-mono text-[12px] text-text-tertiary">agent</span>
          <div>
            {text && (
              <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-text-secondary">
                {text}
              </p>
            )}
            {toolParts.map((p, i) => {
              if (p.type === "tool-navigate") {
                const done = p.state === "output-available";
                return (
                  <div key={i} className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <span className={done ? "text-sage" : "text-warn"}>{done ? "ok" : "..."}</span>
                    <span className="font-mono text-text-tertiary">
                      navigated to {p.output?.path ?? "..."}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ChipMono } from "@/components/ui/primitives/ChipMono";

const SUGGESTIONS = [
  "/why-hire",
  "/open GroundTruth",
  "/show evidence",
  "/summarize impact",
  "/open TracePilot",
];

export function CommandLayer() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigatedIds = useRef(new Set<string>());

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

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

  const isBusy = status === "submitted" || status === "streaming";

  function submit(text: string) {
    const t = text.trim();
    if (!t || isBusy) return;
    sendMessage({ text: t });
    setInput("");
  }

  return (
    <section
      aria-label="Command layer"
      className="flex h-full flex-col bg-surface-inset"
      style={{
        boxShadow: "0 -1px 0 rgba(255,255,255,0.03), 0 -4px 16px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header bar */}
      <div className="flex h-9 shrink-0 items-center px-5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
          <span className="text-[12px] font-medium text-foreground">
            Command
          </span>
        </div>
        <span className="ml-3 hidden text-[11px] text-text-tertiary md:inline">
          ask anything about this portfolio
        </span>
        <span className="ml-auto font-mono text-[10.5px] text-text-tertiary">
          ⌘K
        </span>
      </div>

      {/* Conversation stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col justify-end">
            <p className="text-[13px] leading-relaxed text-text-tertiary">
              Ask a question, run a command, or explore Harneet's work.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <ChipMono key={s} onClick={() => submit(s)}>
                  {s}
                </ChipMono>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}

        {isBusy && (
          <div className="mt-3 flex items-center gap-2 text-[13px] text-text-tertiary">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sage/60" />
            thinking
          </div>
        )}

        {error && (
          <div className="mt-3 text-[12px] text-warn">
            Connection unavailable — try again or browse manually.
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex h-12 shrink-0 items-center gap-3 rounded-[10px] mx-5 mb-3 bg-surface-card/60 px-4"
      >
        <span className="text-[14px] text-sage">→</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isBusy}
          placeholder="Ask anything about Harneet's work..."
          className="h-full flex-1 bg-transparent text-[14px] text-foreground placeholder:text-text-tertiary/50 focus:outline-none disabled:opacity-50"
        />
        {isBusy && (
          <span className="inline-block h-3 w-[2px] animate-pulse bg-sage/70" />
        )}
      </form>
    </section>
  );
}

function MessageRow({
  message,
}: {
  message: ReturnType<typeof useChat>["messages"][number];
}) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  const toolParts = message.parts.filter((p) =>
    p.type.startsWith("tool-"),
  ) as Array<{
    type: string;
    state?: string;
    output?: { path?: string; reason?: string };
  }>;

  return (
    <div className={cn("mt-3", isUser ? "" : "")}>
      {isUser ? (
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            you
          </span>
          <span className="text-[13px] text-foreground">{text}</span>
        </div>
      ) : (
        <div>
          {text && (
            <p className="whitespace-pre-wrap text-[13px] leading-[1.7] text-text-secondary">
              {text}
            </p>
          )}
          {toolParts.map((p, i) => {
            if (p.type === "tool-navigate") {
              const done = p.state === "output-available";
              return (
                <div
                  key={i}
                  className="mt-1.5 flex items-center gap-2 text-[11px] text-text-tertiary"
                >
                  <span className={done ? "text-sage" : "text-warn"}>↳</span>
                  <span className="font-mono">
                    navigated to {p.output?.path ?? "…"}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

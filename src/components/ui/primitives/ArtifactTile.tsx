import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export type ArtifactKind =
  | "groundtruth"
  | "robbymd"
  | "memcontext"
  | "codetune"
  | "tracepilot"
  | "driftengine";

export function ArtifactTile({ kind, className }: { kind: ArtifactKind; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative h-[110px] w-[260px] shrink-0 overflow-hidden rounded-tile border border-border-hair bg-surface-inset p-3",
        className,
      )}
    >
      {kind === "groundtruth" && <Groundtruth />}
      {kind === "robbymd" && <Robbymd />}
      {kind === "codetune" && <Codetune />}
      {kind === "tracepilot" && <Tracepilot />}
      {kind === "memcontext" && <Memcontext />}
      {kind === "driftengine" && <Driftengine />}
    </div>
  );
}

function Robbymd() {
  const items = [
    { label: "Pulmonary embolism", score: 0.91 },
    { label: "Pneumonia", score: 0.74 },
    { label: "Heart failure", score: 0.58 },
  ];
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Differential</Eyebrow>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="animate-fade-up inline-block h-1.5 rounded-full bg-sage"
              style={{
                width: `${item.score * 60}px`,
                opacity: 1 - i * 0.2,
                animationDelay: `${i * 100}ms`,
              }}
            />
            <span
              className="animate-fade-up font-mono text-[10px] text-text-secondary"
              style={{ animationDelay: `${i * 100 + 50}ms` }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <span className="font-mono text-[10px] text-text-tertiary">diagnostic trace</span>
    </div>
  );
}

function Groundtruth() {
  const bars = [6, 10, 8, 14, 11, 16, 12, 18, 14, 20, 17, 22, 26, 30];
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Symbol graph</Eyebrow>
      <div className="flex h-[44px] items-end gap-[3px]">
        {bars.map((h, i) => {
          const isLead = i >= bars.length - 3;
          return (
            <div
              key={i}
              className={cn(isLead ? "bg-sage" : "bg-sage-dim", "animate-grow")}
              style={{
                width: 6,
                height: `${h * 1.4}px`,
                opacity: isLead ? 1 : 0.55,
                animationDelay: `${i * 35}ms`,
              }}
            />
          );
        })}
      </div>
      <span className="font-mono text-[10px] text-text-tertiary">repo signal</span>
    </div>
  );
}

function Codetune() {
  return (
    <div className="flex h-full flex-col gap-1.5 font-mono text-[11px] leading-[1.4]">
      <span className="text-text-tertiary">tool_use.py</span>
      <div className="flex flex-col gap-0.5">
        <span className="animate-fade-up text-warn" style={{ animationDelay: "0ms" }}>
          - base: 8% accuracy
        </span>
        <span className="animate-fade-up text-sage" style={{ animationDelay: "120ms" }}>
          + GRPO: 62% accuracy
        </span>
        <span className="animate-fade-up text-sage" style={{ animationDelay: "240ms" }}>
          + precision: 94%
        </span>
      </div>
      <span className="font-mono text-[10px] text-text-tertiary">SFT + GRPO lift</span>
    </div>
  );
}

function Tracepilot() {
  const pts = [
    [4, 36],
    [40, 28],
    [76, 32],
    [112, 18],
    [148, 24],
    [184, 12],
    [220, 16],
  ];
  const d = pts.map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `L${x} ${y}`)).join(" ");
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Eval quality</Eyebrow>
      <svg width="232" height="44" viewBox="0 0 232 44" className="self-center">
        <path
          d={d}
          fill="none"
          stroke="var(--accent-sage)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw"
          style={{ ["--path-len" as string]: "260" }}
        />
        {pts.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.5"
            fill="var(--accent-sage)"
            className="animate-fade-up"
            style={{ animationDelay: `${400 + i * 60}ms` }}
          />
        ))}
      </svg>
      <span className="font-mono text-[10px] text-text-tertiary">14-component eval</span>
    </div>
  );
}

function Memcontext() {
  const layers = ["claims", "supersession", "retrieval"];
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Memory layers</Eyebrow>
      <div className="flex flex-col gap-1">
        {layers.map((l, i) => (
          <div key={l} className="flex items-center gap-2">
            <span
              className="animate-fade-up inline-block h-1.5 rounded-full bg-sage"
              style={{
                width: `${60 - i * 14}px`,
                opacity: 1 - i * 0.2,
                animationDelay: `${i * 100}ms`,
              }}
            />
            <span
              className="animate-fade-up font-mono text-[10px] text-text-secondary"
              style={{ animationDelay: `${i * 100 + 50}ms` }}
            >
              {l}
            </span>
          </div>
        ))}
      </div>
      <span className="font-mono text-[10px] text-text-tertiary">88.4% LongMemEval-S</span>
    </div>
  );
}

function Driftengine() {
  const nodes = ["scan", "rank", "approve", "fix"];
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Agent pipeline</Eyebrow>
      <div className="flex items-center gap-1.5">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center gap-1.5">
            <span
              className="animate-fade-up rounded-chip border border-border-hair px-1.5 py-0.5 font-mono text-[10px] text-text-secondary"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {n}
            </span>
            {i < nodes.length - 1 && <span className="h-px w-2 bg-border-line" aria-hidden />}
          </div>
        ))}
      </div>
      <span className="font-mono text-[10px] text-text-tertiary">14 LangGraph agents</span>
    </div>
  );
}

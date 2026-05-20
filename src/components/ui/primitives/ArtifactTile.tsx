import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export type ArtifactKind =
  | "groundtruth"
  | "codetune"
  | "tracepilot"
  | "executiondesk"
  | "robbymd";

export function ArtifactTile({ kind, className }: { kind: ArtifactKind; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative h-[110px] w-[260px] shrink-0 overflow-hidden rounded-[10px] bg-surface-inset p-3",
        className,
      )}
    >
      {kind === "groundtruth" && <Groundtruth />}
      {kind === "codetune" && <Codetune />}
      {kind === "tracepilot" && <Tracepilot />}
      {kind === "executiondesk" && <Executiondesk />}
      {kind === "robbymd" && <Robbymd />}
    </div>
  );
}

function Groundtruth() {
  const bars = [6, 10, 8, 14, 11, 16, 12, 18, 14, 20, 17, 22, 26, 30];
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Eval coverage</Eyebrow>
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
      <span className="font-mono text-[10px] text-text-tertiary">coverage signal</span>
    </div>
  );
}

function Codetune() {
  return (
    <div className="flex h-full flex-col gap-1.5 font-mono text-[11px] leading-[1.4]">
      <span className="text-text-tertiary">optimize.py</span>
      <div className="flex flex-col gap-0.5">
        <span className="animate-fade-up text-warn" style={{ animationDelay: "0ms" }}>
          - for i in range(n):
        </span>
        <span className="animate-fade-up text-sage" style={{ animationDelay: "120ms" }}>
          + for chunk in batched(n):
        </span>
        <span className="animate-fade-up text-text-tertiary" style={{ animationDelay: "240ms" }}>
          + ...
        </span>
      </div>
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
      <Eyebrow>Trace</Eyebrow>
      <svg width="232" height="44" viewBox="0 0 232 44" className="self-center">
        <path
          d={d}
          fill="none"
          stroke="var(--accent-tracepilot)"
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
            fill="var(--accent-tracepilot)"
            className="animate-fade-up"
            style={{ animationDelay: `${400 + i * 60}ms` }}
          />
        ))}
      </svg>
      <span className="font-mono text-[10px] text-text-tertiary">latency trend</span>
    </div>
  );
}

function Executiondesk() {
  const nodes = ["intent", "plan", "execute", "action"];
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Flow</Eyebrow>
      <div className="flex items-center gap-1.5">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center gap-1.5">
            <span
              className="animate-fade-up rounded-[3px] border border-border-line px-1.5 py-0.5 font-mono text-[10px] text-text-secondary"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {n}
            </span>
            {i < nodes.length - 1 && (
              <span className="h-px w-2 bg-border-line" aria-hidden />
            )}
          </div>
        ))}
      </div>
      <span className="font-mono text-[10px] text-text-tertiary">agent stages</span>
    </div>
  );
}

function Robbymd() {
  const items = ["Pulmonary embolism", "Pneumonia", "Heart failure"];
  return (
    <div className="flex h-full flex-col justify-between">
      <Eyebrow>Differential</Eyebrow>
      <ol className="flex flex-col gap-0.5 font-mono text-[11px] text-text-secondary">
        {items.map((it, i) => (
          <li
            key={it}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <span className="text-text-tertiary">{i + 1}.</span> {it}
          </li>
        ))}
        <li className="text-text-tertiary">…</li>
      </ol>
    </div>
  );
}

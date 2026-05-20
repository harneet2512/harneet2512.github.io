import { useState } from "react";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { cn } from "@/lib/utils";

const FOCUS = [
  "Healthcare AI workflows",
  "Agentic systems and tool use",
  "Evaluation infrastructure",
  "Developer + operator tooling",
  "Product strategy under constraint",
];

const SIGNALS = [
  "GroundTruth",
  "CodeTune",
  "TracePilot",
  "ExecutionDesk AI",
  "RobbyMD",
];

const GRID_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='3' height='3' fill='rgba(159,203,168,0.12)'/%3E%3C/svg%3E\")";

export function BuilderContext() {
  const [hovered, setHovered] = useState(false);

  return (
    <aside
      className="flex h-full flex-col gap-6 border-l-0 bg-surface-inset px-7 py-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between">
        <Eyebrow>Builder Signature</Eyebrow>
        <span className="font-mono text-[10.5px] text-text-tertiary">v1.0</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-[8px] bg-surface-card">
          <div
            className={cn(
              "absolute inset-0 rounded-[6px] transition-opacity duration-300",
              hovered ? "opacity-100" : "opacity-0",
            )}
            style={{ backgroundImage: GRID_PATTERN, backgroundSize: "8px 8px" }}
            aria-hidden
          />
          <span className="relative z-10 font-sans text-[14px] font-semibold tracking-tight text-foreground">
            HB
          </span>
        </div>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[14px] font-medium text-foreground">Harneet Bali</span>
          <span className="text-[12px] text-text-tertiary">AI Engineer + Product Builder</span>
        </div>
      </div>

      <p className="text-[13px] leading-[1.65] text-text-secondary">
        Builder at the intersection of product, AI systems, and healthcare workflows.
        Focused on shipping tools that survive real users and real constraints.
      </p>

      <MetaPair label="Focus areas">
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {FOCUS.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-[12.5px] text-text-secondary"
            >
              <span className="h-1 w-1 rounded-full bg-sage/70" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </MetaPair>

      <MetaPair label="Current lens">
        Evaluation infrastructure for agentic systems — where adoption breaks before
        accuracy does.
      </MetaPair>

      <motion.div
        initial={false}
        animate={{
          height: hovered ? "auto" : 0,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className="overflow-hidden"
      >
        <Eyebrow>Active signals</Eyebrow>
        <ul className="mt-2 flex flex-col gap-1.5">
          {SIGNALS.map((s) => (
            <li
              key={s}
              className="flex items-center gap-2 text-[12px] text-text-secondary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sage/60" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10.5px] leading-relaxed text-text-tertiary">
          Identity texture from contribution patterns and shipped artifacts.
        </p>
      </motion.div>
    </aside>
  );
}

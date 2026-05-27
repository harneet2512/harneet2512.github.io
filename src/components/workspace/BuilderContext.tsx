import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";

const FOCUS = [
  "AI Systems",
  "Product Execution",
  "Healthcare Workflows",
  "Developer Tools",
  "Evaluation Infrastructure",
];

export function BuilderContext() {
  return (
    <aside className="flex h-full flex-col gap-7 bg-surface-inset px-7 py-8">
      <div className="flex items-center justify-between">
        <Eyebrow>Builder Context</Eyebrow>
        <span className="font-mono text-[10.5px] text-text-tertiary">v1.0</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-row border border-border-hair bg-surface-card">
          <span className="font-sans text-[15px] font-semibold text-foreground">HB</span>
        </div>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[16px] font-medium text-foreground">Harneet Bali</span>
          <span className="mt-1 text-[12.5px] text-text-secondary">
            AI Engineer + Product Builder
          </span>
        </div>
      </div>

      <p className="text-[13px] leading-[1.7] text-text-secondary">
        Builder at the intersection of AI systems, product execution, and real-world workflow
        constraints.
      </p>

      <MetaPair label="Focus Areas">
        <ul className="mt-1 flex flex-col gap-2">
          {FOCUS.map((focus) => (
            <li key={focus} className="flex items-center gap-2 text-[12.5px] text-text-secondary">
              <span className="h-1 w-1 rounded-full bg-sage" aria-hidden />
              {focus}
            </li>
          ))}
        </ul>
      </MetaPair>

      <MetaPair label="Current Lens">
        Engineering depth + product judgment + shipped systems.
      </MetaPair>

      <div className="mt-auto">
        <div className="glitch-wordmark" data-text="HARNEET" aria-hidden>
          HARNEET
        </div>
      </div>
    </aside>
  );
}

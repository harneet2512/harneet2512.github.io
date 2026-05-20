import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { StatusDot } from "@/components/ui/primitives/StatusDot";

export function ThesisConsole() {
  return (
    <section className="relative pt-4 pb-10">
      <div
        className="pointer-events-none absolute -top-20 left-0 h-[300px] w-[500px]"
        style={{
          background:
            "radial-gradient(ellipse at 20% 40%, rgba(159,203,168,0.06), transparent 70%)",
        }}
        aria-hidden
      />

      <h1
        className="animate-fade-up font-sans text-foreground"
        style={{
          fontSize: "clamp(48px, 6.5vw, 80px)",
          lineHeight: 1.0,
          letterSpacing: "-0.04em",
          fontWeight: 700,
        }}
      >
        Harneet Bali
      </h1>

      <p className="mt-3 text-[15px] tracking-[-0.01em] text-text-secondary">
        AI Engineer + Product Builder
      </p>

      <p
        className="mt-8 max-w-[24ch] animate-fade-up text-foreground/90"
        style={{
          fontSize: "clamp(22px, 2.5vw, 32px)",
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          fontWeight: 500,
          animationDelay: "60ms",
        }}
      >
        Build AI workflows that survive real users, real constraints, and real
        metrics.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-[4px] border border-border-hair bg-surface-raised/40 px-2.5 py-1.5">
        <StatusDot tone="sage" />
        <span className="text-[12px] text-text-secondary">
          Currently shipping eval infra @ ConnectiveRx
        </span>
      </div>

      <dl className="mt-10 grid gap-6 sm:grid-cols-3">
        <MetaPair label="Stack">
          Healthcare AI · Agentic systems · Eval infrastructure
        </MetaPair>
        <MetaPair label="Mode">
          Ship, measure, harden, write the case file.
        </MetaPair>
        <MetaPair label="Base">CMU MISM · ConnectiveRx</MetaPair>
      </dl>
    </section>
  );
}

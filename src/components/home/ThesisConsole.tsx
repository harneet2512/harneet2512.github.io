import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { StatusDot } from "@/components/ui/primitives/StatusDot";

export function ThesisConsole() {
  return (
    <section className="border-b border-border-hair pb-10 pt-2">
      <h1 className="animate-fade-up font-sans text-[48px] font-semibold leading-[1.05] text-foreground md:text-[52px]">
        Harneet Bali
      </h1>

      <p className="mt-3 text-[15px] text-text-secondary">AI Engineer + Product Builder</p>

      <p
        className="mt-8 max-w-[28ch] animate-fade-up text-[24px] font-medium leading-[1.28] text-foreground md:text-[30px]"
        style={{ animationDelay: "60ms" }}
      >
        Build AI workflows that survive real users, real constraints, and real metrics.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-chip border border-border-hair px-2.5 py-1.5">
        <StatusDot tone="sage" />
        <span className="text-[12px] text-text-secondary">
          Currently shipping eval infra @ ConnectiveRx
        </span>
      </div>

      <dl className="mt-10 grid gap-6 sm:grid-cols-3">
        <MetaPair label="Stack">Healthcare AI · Agentic systems · Eval infrastructure</MetaPair>
        <MetaPair label="Mode">Ship, measure, harden, write the case file.</MetaPair>
        <MetaPair label="Base">CMU MISM · ConnectiveRx</MetaPair>
      </dl>
    </section>
  );
}

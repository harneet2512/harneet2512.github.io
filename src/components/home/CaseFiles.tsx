import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { RowCard } from "@/components/ui/primitives/RowCard";

const FILES = [
  {
    n: "01",
    title: "Foundation",
    claim: "Technical systems → AI research → product judgment.",
    evidence: "Engineering base · ML research · systems coursework",
    accent: "var(--accent-sage)",
  },
  {
    n: "02",
    title: "Operator mode",
    claim:
      "Analytics → workflows → adoption → measurable cycle-time reduction.",
    evidence: "Shipped AI workflow · rollout · enablement loops",
    accent: "var(--accent-executiondesk)",
  },
  {
    n: "03",
    title: "Current edge",
    claim: "Healthcare AI + agentic tooling + eval infrastructure.",
    evidence: "ConnectiveRx · GroundTruth · RobbyMD · TracePilot",
    accent: "var(--accent-tracepilot)",
  },
];

export function CaseFiles() {
  return (
    <section className="flex flex-col gap-3">
      <Eyebrow>Thesis chapters</Eyebrow>
      <div className="flex flex-col gap-3">
        {FILES.map((f) => (
          <RowCard
            key={f.n}
            number={f.n}
            accent={f.accent}
            title={
              <div className="flex flex-col gap-1.5">
                <h3 className="font-sans text-[17px] font-medium leading-tight tracking-[-0.005em] text-foreground">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-[1.55] text-text-secondary">
                  {f.claim}
                </p>
              </div>
            }
            meta={
              <dl>
                <MetaPair label="Evidence">{f.evidence}</MetaPair>
              </dl>
            }
          />
        ))}
      </div>
    </section>
  );
}

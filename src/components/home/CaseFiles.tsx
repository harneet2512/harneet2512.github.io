import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";

const FILES = [
  {
    n: "01",
    title: "Foundation",
    claim: "Technical systems to AI research to product judgment.",
    evidence: "Engineering base · ML research · systems coursework",
  },
  {
    n: "02",
    title: "Operator mode",
    claim: "Analytics to workflows to adoption to measurable cycle-time reduction.",
    evidence: "Shipped AI workflow · rollout · enablement loops",
  },
  {
    n: "03",
    title: "Current edge",
    claim: "Healthcare AI + agentic tooling + eval infrastructure.",
    evidence: "ConnectiveRx · GroundTruth · RobbyMD · TracePilot",
  },
];

export function CaseFiles() {
  return (
    <section className="flex flex-col gap-4">
      <Eyebrow>Thesis chapters</Eyebrow>
      <div className="divide-y divide-border-hair border-y border-border-hair">
        {FILES.map((f) => (
          <div
            key={f.n}
            className="grid gap-4 py-5 md:grid-cols-[64px_minmax(0,1fr)_minmax(220px,0.62fr)] md:items-start"
          >
            <span className="font-mono text-[13px] text-text-tertiary">{f.n}</span>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[20px] font-medium leading-tight text-foreground">{f.title}</h3>
              <p className="text-[14px] leading-[1.55] text-text-secondary">{f.claim}</p>
            </div>
            <dl>
              <MetaPair label="Evidence">{f.evidence}</MetaPair>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

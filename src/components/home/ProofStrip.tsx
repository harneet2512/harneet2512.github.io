import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";

const PROOF: Array<{ label: string; value: string }> = [
  { label: "Cycle time", value: "~60% reduction" },
  { label: "Shipped", value: "5 canonical projects" },
  { label: "Production", value: "AI workflow shipped" },
  { label: "Base", value: "CMU MISM '25" },
  { label: "Operator", value: "ConnectiveRx" },
];

export function ProofStrip() {
  return (
    <section className="shadow-card rounded-[12px] bg-surface-card px-6 py-5 transition-all duration-300 hover:shadow-card-hover">
      <Eyebrow>Proof of work</Eyebrow>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {PROOF.map((p) => (
          <MetaPair key={p.label} label={p.label}>
            {p.value}
          </MetaPair>
        ))}
      </dl>
    </section>
  );
}

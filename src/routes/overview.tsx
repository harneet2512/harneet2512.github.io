import { createFileRoute } from "@tanstack/react-router";

import { ProofStrip } from "@/components/home/ProofStrip";
import { SignalMap } from "@/components/home/SignalMap";
import { PageHeader } from "@/components/workspace/PageHeader";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Overview — Harneet Bali" },
      {
        name: "description",
        content:
          "Workspace overview: thesis, proof of work, and the project signal map across AI systems and healthcare ops.",
      },
      { property: "og:title", content: "Overview — Harneet Bali" },
      {
        property: "og:description",
        content: "Thesis, proof, and project signal map at a glance.",
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Workspace"
        title="Overview."
        dek="A condensed read of the workspace: what's proven, what's being built, and how projects relate across domains."
      />
      <ProofStrip />
      <SignalMap />
    </div>
  );
}

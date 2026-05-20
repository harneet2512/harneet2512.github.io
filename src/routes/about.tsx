import { createFileRoute } from "@tanstack/react-router";

import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { PageHeader } from "@/components/workspace/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Harneet Bali" },
      {
        name: "description",
        content:
          "Harneet Bali: AI Engineer and Product Builder working at the intersection of product, AI systems, and healthcare workflows.",
      },
      { property: "og:title", content: "About — Harneet Bali" },
      {
        property: "og:description",
        content:
          "Builder at the intersection of product, AI systems, and healthcare workflows.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Builder context"
        title="About Harneet."
        dek="Builder at the intersection of product, AI systems, and healthcare workflows. Focused on tools that survive real users and real constraints."
      />

      <section className="grid gap-3 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-5 shadow-card rounded-[12px] bg-surface-card p-7">
          <p className="max-w-[62ch] text-[15px] leading-[1.7] text-text-secondary">
            I build AI products where the hard part is not the demo — it is
            trust, adoption, measurement, and operational fit. My focus is
            healthcare AI, agentic systems, and the evaluation infrastructure
            that keeps them honest in production.
          </p>
          <p className="max-w-[62ch] text-[15px] leading-[1.7] text-text-secondary">
            Currently at ConnectiveRx; previously CMU MISM. I work across
            product and engineering surfaces — from shaping the thesis to
            shipping the workflow that survives real users.
          </p>
        </div>

        <aside className="shadow-card rounded-[12px] bg-surface-card p-7">
          <dl className="flex flex-col gap-5">
            <MetaPair label="Now">ConnectiveRx · Healthcare AI</MetaPair>
            <MetaPair label="Base">CMU MISM</MetaPair>
            <MetaPair label="Lens">
              Eval infrastructure for agentic systems.
            </MetaPair>
            <MetaPair label="Contact">harneet2512singh@gmail.com</MetaPair>
          </dl>
        </aside>
      </section>
    </article>
  );
}

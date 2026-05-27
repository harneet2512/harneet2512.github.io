import { createFileRoute } from "@tanstack/react-router";

import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { PageHeader } from "@/components/workspace/PageHeader";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline - Harneet Bali" },
      {
        name: "description",
        content:
          "Career timeline: CMU MISM, ConnectiveRx, shipped AI workflows, and current edge in healthcare AI and agentic tooling.",
      },
      { property: "og:title", content: "Timeline - Harneet Bali" },
      {
        property: "og:description",
        content: "From engineering base to product-grade AI systems.",
      },
    ],
  }),
  component: TimelinePage,
});

const ITEMS = [
  {
    year: "2025-now",
    title: "AI Product Manager Intern",
    body: "Cut claims and QA cycle time with enterprise AI automation and workflow systems.",
    focus: "ConnectiveRx",
  },
  {
    year: "2025",
    title: "Graduate Strategy Consultant",
    body: "Defined GTM and feature strategy for semantic benchmarking and recommendation flows.",
    focus: "AdSkate / CMU CSL",
  },
  {
    year: "2024-2025",
    title: "M.S. Information Systems Management",
    body: "Formalized the PM and AI systems bridge through graduate product and data work.",
    focus: "Carnegie Mellon",
  },
  {
    year: "2023-2024",
    title: "Business Analyst",
    body: "Led dashboard, ETL, and vendor tooling efforts that improved forecasting and costs.",
    focus: "Dolfin Rubbers",
  },
  {
    year: "2022",
    title: "Data Analyst",
    body: "Shipped analytics workflows that improved insight delivery and operational efficiency.",
    focus: "Ganit Business Solutions",
  },
  {
    year: "2020-2022",
    title: "AI Research Assistant",
    body: "Worked on ML systems and research workflows with a strong technical foundation.",
    focus: "Manipal Institute",
  },
  {
    year: "2018-2022",
    title: "B.Tech, Electrical and Electronics",
    body: "Built the technical base that later expanded into AI research and product work.",
    focus: "Manipal Institute",
  },
];

function TimelinePage() {
  return (
    <article className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Career"
        title="Timeline."
        dek="Seven chapters that compound into the current edge."
      />

      <div className="divide-y divide-border-hair border-y border-border-hair">
        {ITEMS.map((it) => (
          <div
            key={it.year}
            className="grid gap-4 py-5 md:grid-cols-[96px_minmax(0,1fr)_minmax(180px,0.45fr)]"
          >
            <span className="font-mono text-[12px] text-text-tertiary">{it.year}</span>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[20px] font-medium leading-tight text-foreground">{it.title}</h2>
              <p className="text-[13px] leading-[1.55] text-text-secondary">{it.body}</p>
            </div>
            <dl>
              <MetaPair label="Focus">{it.focus}</MetaPair>
            </dl>
          </div>
        ))}
      </div>
    </article>
  );
}

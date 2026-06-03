import { createFileRoute, Link } from "@tanstack/react-router";

import { ArtifactTile, type ArtifactKind } from "@/components/ui/primitives/ArtifactTile";
import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { RowCard } from "@/components/ui/primitives/RowCard";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects - Harneet Bali" },
      {
        name: "description",
        content:
          "Six case files: GroundTruth, RobbyMD, MemContext, CodeTune, TracePilot, and DriftEngine.",
      },
      { property: "og:title", content: "Projects - Harneet Bali" },
      {
        property: "og:description",
        content:
          "Case-file index across MCP tooling, RL training, enterprise RAG, agent memory, and process drift.",
      },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  slug: ArtifactKind;
  title: string;
  dek: string;
  domains: string;
  evidence: string;
};

const PROJECTS: Project[] = [
  {
    slug: "groundtruth",
    title: "GroundTruth",
    dek: "Grounding layer for AI coding agents with deterministic codebase intelligence.",
    domains: "MCP · Developer Tools · Eval Infrastructure",
    evidence: "+2.4pp SWE-bench · 16 MCP tools · $0 evidence cost",
  },
  {
    slug: "robbymd",
    title: "RobbyMD",
    dek: "Diagnostic trace system preserving physician reasoning pathways.",
    domains: "Clinical AI · Managed Agents · Provenance",
    evidence: "88.4% LongMemEval-S · 59.3% MedXpertQA · 5 agents",
  },
  {
    slug: "memcontext",
    title: "MemContext",
    dek: "Persistent memory layer for AI agents with provenance tracking.",
    domains: "MCP · Agent Memory · Retrieval",
    evidence: "88.4% LongMemEval-S · 5 MCP tools · hybrid retrieval",
  },
  {
    slug: "codetune",
    title: "CodeTune",
    dek: "Tool-use RL training: SFT + GRPO on Qwen 2.5 7B.",
    domains: "RL · Tool Use · Model Training",
    evidence: "+54pp accuracy · 94% tool precision · 85% restraint",
  },
  {
    slug: "tracepilot",
    title: "TracePilot",
    dek: "Enterprise RAG with 14-component eval suite and CI regression gates.",
    domains: "Enterprise RAG · Eval Infra · Product Ops",
    evidence: "14 eval components · 4 connectors · 10 admin views",
  },
  {
    slug: "driftengine",
    title: "DriftEngine",
    dek: "Process drift detection across organizational tools.",
    domains: "MCP · LangGraph · Process Ops",
    evidence: "14 agents · 7 integrations · human approval loop",
  },
];

function ProjectsPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-border-hair pb-7">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="font-sans text-[42px] font-semibold leading-[1.08] text-foreground md:text-[48px]">
              Projects
            </h1>
            <p className="max-w-[60ch] text-[15px] leading-[1.55] text-text-secondary">
              Six case files across MCP tooling, clinical AI, model training, enterprise RAG, agent
              memory, and process intelligence.
            </p>
          </div>
          <button
            type="button"
            className="hidden h-9 shrink-0 items-center gap-2 rounded-chip border border-border-hair bg-transparent px-3 font-mono text-[12px] text-text-secondary transition-colors hover:border-border-line hover:text-foreground md:inline-flex"
          >
            <span className="text-sage">+</span> New case
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {PROJECTS.map((p, i) => (
          <RowCard
            key={p.slug}
            number={String(i + 1).padStart(2, "0")}
            accent="var(--accent-sage)"
            title={
              <div className="flex flex-col gap-1.5">
                <h2 className="font-sans text-[22px] font-semibold leading-tight text-foreground">
                  {p.title}
                </h2>
                <p className="text-[13px] leading-[1.5] text-text-secondary">{p.dek}</p>
              </div>
            }
            meta={
              <dl className="flex flex-col gap-3">
                <MetaPair label="Domains">{p.domains}</MetaPair>
                <MetaPair label="Evidence">{p.evidence}</MetaPair>
              </dl>
            }
            artifact={<ArtifactTile kind={p.slug} />}
            action={
              <Link
                to="/case/$slug"
                params={{ slug: p.slug }}
                className="font-sans text-[13px] text-sage transition-opacity hover:opacity-80"
              >
                Open case →
              </Link>
            }
          />
        ))}
      </div>
    </article>
  );
}

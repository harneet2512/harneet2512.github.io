import { createFileRoute, Link } from "@tanstack/react-router";

import { ArtifactTile, type ArtifactKind } from "@/components/ui/primitives/ArtifactTile";
import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { RowCard } from "@/components/ui/primitives/RowCard";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Harneet Bali" },
      {
        name: "description",
        content:
          "Five canonical projects: GroundTruth, CodeTune, TracePilot, ExecutionDesk AI, and RobbyMD.",
      },
      { property: "og:title", content: "Projects — Harneet Bali" },
      {
        property: "og:description",
        content: "Case-file index across AI systems, healthcare ops, and developer tools.",
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
    dek: "Evaluation infrastructure for AI in healthcare workflows.",
    domains: "Eval Infra · Healthcare AI",
    evidence: "Coverage harness · run logs",
  },
  {
    slug: "codetune",
    title: "CodeTune",
    dek: "Developer tooling for tuning model-driven code changes.",
    domains: "Dev Tools · LLM Workflows",
    evidence: "Diff samples · review notes",
  },
  {
    slug: "tracepilot",
    title: "TracePilot",
    dek: "Trace-first observability for agentic systems.",
    domains: "Agents · Observability",
    evidence: "Trace samples · failure modes",
  },
  {
    slug: "executiondesk",
    title: "ExecutionDesk AI",
    dek: "Operator desk for AI-mediated workflow execution.",
    domains: "Agents · Product Ops",
    evidence: "Flow specs · operator interviews",
  },
  {
    slug: "robbymd",
    title: "RobbyMD",
    dek: "Clinical assistant tuned to real-world adoption constraints.",
    domains: "Healthcare AI · Product",
    evidence: "Clinician sessions · differentials",
  },
];

function ProjectsPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-border-hair pb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h1
              className="font-sans text-foreground"
              style={{
                fontSize: "clamp(28px, 3.4vw, 36px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              Projects
            </h1>
            <p className="max-w-[60ch] text-[14px] leading-[1.55] text-text-secondary">
              Five canonical case files. Each one shipped under real constraints — clinical
              workflows, production agents, or developer tooling.
            </p>
          </div>
          <button
            type="button"
            className="hidden h-9 shrink-0 items-center gap-2 rounded-[6px] border border-border-line bg-transparent px-3 font-mono text-[12px] text-text-secondary transition-colors hover:border-border-strong hover:text-foreground md:inline-flex"
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
            accent={`var(--accent-${p.slug})`}
            title={
              <div className="flex flex-col gap-1.5">
                <h2 className="font-sans text-[22px] font-semibold leading-tight tracking-[-0.015em] text-foreground">
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

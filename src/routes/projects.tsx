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
          "Five canonical case files: GroundTruth, CodeTune, TracePilot, ExecutionDesk AI, and RobbyMD.",
      },
      { property: "og:title", content: "Projects - Harneet Bali" },
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
    dek: "Compiler-grade codebase intelligence for AI coding agents.",
    domains: "AI Systems · Developer Tools · Eval Infrastructure",
    evidence: "MCP server · SWE-bench metrics · agent context layer",
  },
  {
    slug: "codetune",
    title: "CodeTune",
    dek: "LLM-native code optimization and tool-use training.",
    domains: "AI Engineering · Developer Tools · Model Behavior",
    evidence: "SFT/GRPO · tool precision lift · playground",
  },
  {
    slug: "tracepilot",
    title: "TracePilot",
    dek: "Trace-first observability for agentic product workflows.",
    domains: "Observability · Product Ops · Debugging",
    evidence: "traces · failure modes · workflow diagnostics",
  },
  {
    slug: "executiondesk",
    title: "ExecutionDesk AI",
    dek: "Operator desk for AI-mediated workflow execution.",
    domains: "Workflow Automation · Product Ops · Agents",
    evidence: "command surface · action routing · execution loop",
  },
  {
    slug: "robbymd",
    title: "RobbyMD",
    dek: "Clinical reasoning assistant tuned to real-world adoption constraints.",
    domains: "Healthcare AI · Clinical Workflow · Evidence UX",
    evidence: "differential reasoning · SOAP draft · provenance",
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
              Five case files across AI systems, developer tools, healthcare workflows, and product
              execution.
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

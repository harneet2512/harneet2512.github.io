import { createFileRoute, notFound } from "@tanstack/react-router";

import { CaseFileTemplate } from "@/components/case/CaseFileTemplate";

type Case = {
  code: string;
  title: string;
  oneLiner: string;
  stages: { label: string; body: string }[];
  meta: { title: string; description: string };
};

const CASES: Record<string, Case> = {
  groundtruth: {
    code: "CASE-01",
    title: "GroundTruth",
    oneLiner:
      "Evaluation infrastructure that lets healthcare AI systems prove they are correct, in context, on real workflows.",
    stages: [
      {
        label: "Signal",
        body: "Healthcare AI demos rarely survive production data and clinical edge cases.",
      },
      {
        label: "Evidence",
        body: "Workflow-level eval traces; reviewer disagreement as a first-class signal.",
      },
      { label: "Decision", body: "Build evaluation as infrastructure, not a one-off audit." },
      { label: "Artifact", body: "Eval harness + reviewer console + regression suite." },
      { label: "Impact", body: "Cycle-time reduction on safe rollouts; measurable trust loop." },
    ],
    meta: {
      title: "GroundTruth — Case File",
      description: "Evaluation infrastructure for AI in healthcare workflows.",
    },
  },
  codetune: {
    code: "CASE-02",
    title: "CodeTune",
    oneLiner:
      "Developer tooling that turns model-driven code changes into reviewable, tunable artifacts.",
    stages: [
      { label: "Signal", body: "Model-driven edits are fast to generate, slow to trust." },
      { label: "Evidence", body: "Repeated reviewer rework on AI-suggested diffs." },
      { label: "Decision", body: "Make the tuning loop legible to the developer." },
      { label: "Artifact", body: "Diff-level controls + per-rule evaluation surface." },
      { label: "Impact", body: "Higher accept rate, lower rework, predictable behavior." },
    ],
    meta: {
      title: "CodeTune — Case File",
      description: "Developer tooling for tuning model-driven code changes.",
    },
  },
  tracepilot: {
    code: "CASE-03",
    title: "TracePilot",
    oneLiner: "Trace-first observability for agentic systems running in production.",
    stages: [
      { label: "Signal", body: "Agents fail in ways logs do not explain." },
      { label: "Evidence", body: "Recurring incident patterns hidden inside multi-step traces." },
      {
        label: "Decision",
        body: "Make the trace the primary unit of observation, not the log line.",
      },
      { label: "Artifact", body: "Trace explorer with eval overlay + incident replay." },
      { label: "Impact", body: "Faster root cause, less guesswork, measurable MTTR drop." },
    ],
    meta: {
      title: "TracePilot — Case File",
      description: "Trace-first observability for agentic systems.",
    },
  },
  executiondesk: {
    code: "CASE-04",
    title: "ExecutionDesk AI",
    oneLiner: "An operator desk that turns AI-mediated workflows into accountable execution.",
    stages: [
      { label: "Signal", body: "Operators distrust AI workflows they cannot interrupt." },
      { label: "Evidence", body: "Shadow operators correcting AI decisions outside the system." },
      { label: "Decision", body: "Design the desk as the workflow, not a dashboard around it." },
      { label: "Artifact", body: "Queue + intervention controls + audit-grade history." },
      { label: "Impact", body: "Adoption holds beyond pilot; measurable cycle-time reduction." },
    ],
    meta: {
      title: "ExecutionDesk AI — Case File",
      description: "Operator desk for AI-mediated workflow execution.",
    },
  },
  robbymd: {
    code: "CASE-05",
    title: "RobbyMD",
    oneLiner:
      "A clinical assistant tuned to real-world adoption constraints, not benchmark scores.",
    stages: [
      {
        label: "Signal",
        body: "Clinical assistants over-index on benchmarks, under-index on fit.",
      },
      { label: "Evidence", body: "Drop-off between pilot enthusiasm and daily clinical use." },
      { label: "Decision", body: "Optimize for the constraints clinicians actually live in." },
      { label: "Artifact", body: "Assistant + guardrails + workflow-aware UI." },
      { label: "Impact", body: "Sustained use; trusted to handle the small repetitive load." },
    ],
    meta: {
      title: "RobbyMD — Case File",
      description: "Clinical assistant tuned to real-world adoption constraints.",
    },
  },
};

export const Route = createFileRoute("/case/$slug")({
  loader: ({ params }) => {
    const c = CASES[params.slug];
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.meta.title },
          { name: "description", content: loaderData.meta.description },
          { property: "og:title", content: loaderData.meta.title },
          { property: "og:description", content: loaderData.meta.description },
        ]
      : [],
  }),
  component: CasePage,
});

function CasePage() {
  const c = Route.useLoaderData();
  return <CaseFileTemplate code={c.code} title={c.title} oneLiner={c.oneLiner} stages={c.stages} />;
}

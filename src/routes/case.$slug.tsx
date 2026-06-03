import { createFileRoute, notFound } from "@tanstack/react-router";

import { CaseFileTemplate } from "@/components/case/CaseFileTemplate";

type Demo = {
  kind: "image" | "gif" | "video";
  src: string;
  alt: string;
  label: string;
  repo: string;
};

type Case = {
  code: string;
  title: string;
  oneLiner: string;
  stages: { label: string; body: string }[];
  demo?: Demo;
  meta: { title: string; description: string };
};

const CASES: Record<string, Case> = {
  groundtruth: {
    code: "CASE-01",
    title: "GroundTruth",
    oneLiner:
      "Grounding layer for AI coding agents. Tree-sitter indexer, 16 deterministic MCP tools, 7 evidence families, zero LLM cost.",
    demo: {
      kind: "image",
      src: "https://raw.githubusercontent.com/harneet2512/groundtruth/master/groundtruth_hero.png",
      alt: "GroundTruth 3D code city visualization",
      label: "repo preview",
      repo: "https://github.com/harneet2512/groundtruth",
    },
    stages: [
      {
        label: "Signal",
        body: "AI coding agents hallucinate symbol relationships because they lack structural codebase access.",
      },
      {
        label: "Evidence",
        body: "Tree-sitter AST parsing across 30 languages, pre-computed call graph in SQLite.",
      },
      {
        label: "Decision",
        body: "Serve verified structural evidence through 16 deterministic MCP tools at $0 LLM cost.",
      },
      {
        label: "Artifact",
        body: "MCP server + indexer + 7 evidence families + confidence-scored edges + 3D code city.",
      },
      {
        label: "Impact",
        body: "+2.4pp on SWE-bench Verified, sub-15ms query latency, 96% patch generation rate.",
      },
    ],
    meta: {
      title: "GroundTruth | Case File",
      description: "Grounding layer for AI coding agents with deterministic codebase intelligence.",
    },
  },
  robbymd: {
    code: "CASE-02",
    title: "RobbyMD",
    oneLiner:
      "Anthropic × Cerebral Valley Hackathon. Diagnostic trace system preserving physician reasoning with correction tracking, deterministic differentials, and provenance-backed SOAP notes.",
    demo: {
      kind: "gif",
      src: "https://raw.githubusercontent.com/harneet2512/RobbyMD/main/docs/images/demo.gif",
      alt: "RobbyMD diagnostic trace demo",
      label: "github demo",
      repo: "https://github.com/harneet2512/RobbyMD",
    },
    stages: [
      {
        label: "Signal",
        body: "Physicians lose diagnostic reasoning traces when clinical AI systems autocomplete differentials without provenance.",
      },
      {
        label: "Evidence",
        body: "59.3% accuracy on MedXpertQA, 88.4% on LongMemEval-S across 500 clinical cases.",
      },
      {
        label: "Decision",
        body: "Build a multi-agent trace system with correction tracking, deterministic differentials, and provenance-backed SOAP notes.",
      },
      {
        label: "Artifact",
        body: "5 managed agents, structured differential engine, SOAP note generator with provenance links, correction audit trail.",
      },
      {
        label: "Impact",
        body: "Preserved physician reasoning pathways with full correction lineage and deterministic differential ranking.",
      },
    ],
    meta: {
      title: "RobbyMD | Case File",
      description: "Diagnostic trace system preserving physician reasoning pathways.",
    },
  },
  memcontext: {
    code: "CASE-03",
    title: "MemContext",
    oneLiner:
      "AI memory substrate. Provenance-tracked claims, two-pass supersession, hybrid four-signal retrieval. 88.4% on LongMemEval-S.",
    stages: [
      {
        label: "Signal",
        body: "Agents forget context across sessions with no principled claim management.",
      },
      {
        label: "Evidence",
        body: "88.4% accuracy on LongMemEval-S across 500 cases. 98.6% on single-session user facts.",
      },
      {
        label: "Decision",
        body: "Two-pass supersession (structural + semantic) with composable predicate packs.",
      },
      {
        label: "Artifact",
        body: "MCP server (stdio/HTTP) + FastAPI REST API + browser agent with Playwright + local inference via Ollama.",
      },
      {
        label: "Impact",
        body: "98.6% on single-session user facts, provenance-backed claims that retire stale context automatically.",
      },
    ],
    meta: {
      title: "MemContext | Case File",
      description: "Persistent memory layer for AI agents with provenance tracking.",
    },
  },
  codetune: {
    code: "CASE-04",
    title: "CodeTune",
    oneLiner:
      "Two-stage fine-tuning teaching Qwen 2.5 7B to use tools via SFT + GRPO reinforcement learning. 94% tool precision, +54pp task accuracy.",
    demo: {
      kind: "gif",
      src: "https://raw.githubusercontent.com/harneet2512/Codetune/master/codetune-demo.gif",
      alt: "CodeTune playground demo",
      label: "github demo",
      repo: "https://github.com/harneet2512/Codetune",
    },
    stages: [
      {
        label: "Signal",
        body: "Base models invoke tools unpredictably. Wrong tool, wrong args, or tool calls when plain knowledge suffices.",
      },
      {
        label: "Evidence",
        body: "250-task eval: base model at 8% accuracy, 12% tool precision, 15% restraint.",
      },
      {
        label: "Decision",
        body: "SFT on 250 expert traces + GRPO RL for restraint and precision, QLoRA (r=16, ~87M params).",
      },
      {
        label: "Artifact",
        body: "17 tool schemas across GitHub/Gmail/Drive, full-stack playground with trace viz and eval dashboard.",
      },
      { label: "Impact", body: "+54pp task accuracy, 94% tool precision, 85% restraint score." },
    ],
    meta: {
      title: "CodeTune | Case File",
      description: "Tool-use RL training for language models.",
    },
  },
  tracepilot: {
    code: "CASE-05",
    title: "TracePilot",
    oneLiner:
      "Enterprise RAG system with multi-source ingestion, 14-component eval suite, CI regression gates, and LLM judge scoring.",
    demo: {
      kind: "video",
      src: "/tracepilot-demo.mp4",
      alt: "TracePilot enterprise RAG demo",
      label: "watch demo",
      repo: "https://github.com/harneet2512/TracePilot",
    },
    stages: [
      {
        label: "Signal",
        body: "Enterprise knowledge scattered across Confluence, Jira, Slack, and Drive with no unified retrieval.",
      },
      {
        label: "Evidence",
        body: "Multi-source RAG pipeline with chunking, embedding, and version tracking.",
      },
      {
        label: "Decision",
        body: "Build a 14-component eval suite with golden cases and CI regression gates alongside the RAG system.",
      },
      {
        label: "Artifact",
        body: "10 admin views + voice agent (<250ms) + policy engine + MCP server + custom span tracing.",
      },
      {
        label: "Impact",
        body: "Enterprise-grade answer quality with measurable regression tracking.",
      },
    ],
    meta: {
      title: "TracePilot | Case File",
      description: "Enterprise RAG system with eval infrastructure.",
    },
  },
  driftengine: {
    code: "CASE-06",
    title: "DriftEngine",
    oneLiner:
      "MCP server discovering process drift across Jira, GitHub, Drive, and Slack via 14 LangGraph agents with human approval routing.",
    stages: [
      { label: "Signal", body: "Organizations accumulate process drift silently across tools." },
      {
        label: "Evidence",
        body: "Mismatches between what teams say they do and what systems show, invisible without cross-tool analysis.",
      },
      {
        label: "Decision",
        body: "LangGraph state machine with supervisor, budget allocation, routing, and circuit breakers.",
      },
      {
        label: "Artifact",
        body: "14 agents with reflection loops + evidence ranking + React approval dashboard.",
      },
      { label: "Impact", body: "Drift detection with an approval loop, not just a report." },
    ],
    meta: {
      title: "DriftEngine | Case File",
      description: "MCP server for detecting organizational process drift.",
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
  return (
    <CaseFileTemplate
      code={c.code}
      title={c.title}
      oneLiner={c.oneLiner}
      stages={c.stages}
      demo={c.demo}
    />
  );
}

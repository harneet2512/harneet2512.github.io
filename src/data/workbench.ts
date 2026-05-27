export type WorkbenchProjectId =
  | "groundtruth"
  | "codetune"
  | "tracepilot"
  | "executiondesk"
  | "robbymd";

export type WorkbenchProject = {
  id: WorkbenchProjectId;
  name: string;
  year: string;
  tag: string;
  blurb: string;
  stats?: { n: string; l: string }[];
  featured?: boolean;
  demo?: {
    kind: "image" | "gif" | "video";
    src: string;
    alt: string;
    label: string;
    repo: string;
  };
  details: {
    role: string;
    status: string;
    problem: string;
    approach: string[];
    shipped: string;
    wrong?: string;
    link?: string;
  };
};

export type TimelineBrand =
  | { kind: "self"; label: string; sub: string }
  | { kind: "company"; label: string; mono?: string; sub: string }
  | { kind: "role"; role: string; sub: string }
  | { kind: "school"; label: string; mono: string; sub: string };

export type TimelineEntry = {
  when: string;
  what: string;
  where: string;
  note: string;
  brand: TimelineBrand;
  details: {
    role: string;
    did: string;
    learned: string;
    why?: string;
  };
};

export type WorkbenchSkillGroup = {
  group: string;
  code: string;
  items: string[];
};

export type WorkbenchSidequest = {
  name: string;
  blurb: string;
  year: string;
  treatment: "log" | "letter" | "recipe" | "redact";
  tape?: "red" | "amber";
};

export const workbench = {
  identity: {
    name: "HARNEET BALI",
    displayName: "Harneet Bali",
    role: "AI engineer + product builder",
    location: "Pittsburgh / New York",
    status: "shipping AI workflow systems",
    email: "harneet2512singh@gmail.com",
    github: "https://github.com/harneet2512",
    linkedin: "https://www.linkedin.com/in/harneetbali/",
    pronoun: "he/him",
  },

  about: {
    short:
      "I build AI products where the hard part is not the demo. It is trust, adoption, measurement, and operational fit.",
    long: "My current edge is agentic systems, product operations, and evaluation infrastructure: tools that survive real users, real constraints, and real metrics.",
    thesis: "Build AI workflows that survive real users, real constraints, and real metrics.",
    quirks: [
      "writes the case file before the victory lap",
      "treats dashboards as evidence, not decoration",
      "keeps asking what breaks after the demo",
    ],
  },

  nav: [
    { id: "projects", label: "Projects", count: 5 },
    { id: "skills", label: "Skills", count: 12 },
    { id: "timeline", label: "Timeline", count: 7 },
    { id: "sidequest", label: "Sidequest", count: 4 },
  ],

  projects: [
    {
      id: "groundtruth",
      name: "GroundTruth",
      year: "2025",
      tag: "healthcare AI / eval infra",
      blurb:
        "Evaluation infrastructure for agentic healthcare workflows: traces, reviewer signals, and regression surfaces.",
      stats: [
        { n: "5", l: "workflow surfaces" },
        { n: "3", l: "review loops" },
        { n: "1", l: "operating thesis" },
      ],
      featured: true,
      demo: {
        kind: "image",
        src: "https://raw.githubusercontent.com/harneet2512/groundtruth/master/groundtruth_hero.png",
        alt: "GroundTruth product preview",
        label: "repo preview",
        repo: "https://github.com/harneet2512/groundtruth",
      },
      details: {
        role: "AI systems + product builder",
        status: "current thesis project",
        problem:
          "Healthcare AI demos can look correct while failing under production data, operational interruption, and reviewer disagreement.",
        approach: [
          "Treat the workflow trace as the primary evaluation unit.",
          "Make reviewer disagreement a signal instead of cleanup work.",
          "Turn proof into a repeatable regression surface, not a one-off audit.",
        ],
        shipped: "Eval harness, reviewer console concept, and case-file narrative.",
        wrong:
          "The easy failure mode is optimizing the model before the measurement loop is honest.",
        link: "groundtruth",
      },
    },
    {
      id: "codetune",
      name: "CodeTune",
      year: "2025",
      tag: "developer tools / model behavior",
      blurb: "Tooling for turning model-driven code changes into reviewable, tunable artifacts.",
      stats: [
        { n: "4", l: "eval axes" },
        { n: "2", l: "review loops" },
        { n: "0", l: "magic claims" },
      ],
      demo: {
        kind: "gif",
        src: "https://raw.githubusercontent.com/harneet2512/Codetune/master/codetune-demo.gif",
        alt: "CodeTune demo",
        label: "github demo",
        repo: "https://github.com/harneet2512/Codetune",
      },
      details: {
        role: "AI engineering + product systems",
        status: "case file",
        problem:
          "Model-generated edits are fast to produce and slow to trust when the review loop is opaque.",
        approach: [
          "Expose diff-level controls.",
          "Tie model behavior to per-rule evaluation.",
          "Make the tuning loop legible to the developer.",
        ],
        shipped: "Codegen quality concept, tuning loop, and review surface.",
        wrong: "The trap is measuring generated code volume instead of reviewer trust.",
        link: "codetune",
      },
    },
    {
      id: "tracepilot",
      name: "TracePilot",
      year: "2025",
      tag: "observability / agentic workflows",
      blurb: "Trace-first observability for agents and AI product workflows.",
      demo: {
        kind: "gif",
        src: "https://raw.githubusercontent.com/harneet2512/TracePilot/main/docs/media/tracepilot-main.gif",
        alt: "TracePilot main workflow demo",
        label: "github demo",
        repo: "https://github.com/harneet2512/TracePilot",
      },
      details: {
        role: "systems designer",
        status: "case file",
        problem:
          "Agents fail across prompts, tool calls, state, and handoffs. Plain logs do not explain the behavior.",
        approach: [
          "Make the trace the unit of observation.",
          "Overlay eval signals onto execution spans.",
          "Support incident replay instead of static dashboard watching.",
        ],
        shipped: "Trace explorer concept with eval overlay and workflow diagnostics.",
        wrong: "A dashboard cannot explain a failure if the trace model is wrong.",
        link: "tracepilot",
      },
    },
    {
      id: "executiondesk",
      name: "ExecutionDesk AI",
      year: "2025",
      tag: "workflow automation / product ops",
      blurb:
        "Operator desk for AI-mediated workflow execution: queues, interventions, and audit-grade history.",
      demo: {
        kind: "gif",
        src: "https://raw.githubusercontent.com/harneet2512/ExecutionDesk-AI/main/docs/media/executiondesk-main.gif",
        alt: "ExecutionDesk AI main workflow demo",
        label: "github demo",
        repo: "https://github.com/harneet2512/ExecutionDesk-AI",
      },
      details: {
        role: "AI product operator",
        status: "case file",
        problem:
          "Operators distrust AI workflows they cannot inspect, interrupt, or correct inside the actual system.",
        approach: [
          "Design the desk as the workflow surface.",
          "Give operators clear intervention controls.",
          "Preserve history for accountability and iteration.",
        ],
        shipped: "Command surface, action routing model, and execution loop.",
        wrong:
          "If the human has to leave the system to correct it, the workflow is already leaking.",
        link: "executiondesk",
      },
    },
    {
      id: "robbymd",
      name: "RobbyMD",
      year: "2025",
      tag: "clinical AI / adoption constraints",
      blurb:
        "Clinical reasoning assistant tuned to workflow fit, evidence UX, and adoption constraints.",
      demo: {
        kind: "gif",
        src: "https://raw.githubusercontent.com/harneet2512/RobbyMD/main/docs/images/demo.gif",
        alt: "RobbyMD demo",
        label: "github demo",
        repo: "https://github.com/harneet2512/RobbyMD",
      },
      details: {
        role: "healthcare AI builder",
        status: "case file",
        problem:
          "Clinical assistants over-index on benchmark answers and under-index on how clinicians actually work.",
        approach: [
          "Center the product around clinical workflow constraints.",
          "Surface provenance and differential reasoning.",
          "Optimize for sustained use, not pilot enthusiasm.",
        ],
        shipped: "Clinical assistant concept with guardrails and workflow-aware UI.",
        wrong: "A correct answer at the wrong moment is just another interruption.",
        link: "robbymd",
      },
    },
  ] satisfies WorkbenchProject[],

  skills: [
    {
      group: "AI / ML",
      code: "ML",
      items: [
        "Evaluation design",
        "Agentic systems",
        "RAG",
        "Model behavior",
        "Workflow traces",
        "Reviewer loops",
        "Prompt systems",
        "Guardrails",
        "Regression evals",
        "AI automation",
        "LLM evals",
        "Prompt engineering",
        "MCP",
        "Agent orchestration",
        "LangChain",
        "LangGraph",
        "Eval frameworks",
        "Output filtering",
        "Retry logic",
        "Model selection",
        "Token cost analysis",
        "Reasoning rubrics",
        "Sentence transformers",
        "Local models",
      ],
    },
    {
      group: "Product",
      code: "PROD",
      items: [
        "Workflow mapping",
        "Adoption loops",
        "GTM strategy",
        "Killing vague scope",
        "Roadmaps",
        "User shadowing",
        "PRDs",
        "Feature strategy",
        "Stakeholder loops",
        "Positioning",
        "Case writing",
        "Decision logs",
        "0-to-1 development",
        "A/B testing",
        "Rapid prototyping",
        "Usage analytics",
        "C-suite storytelling",
        "Post-launch analytics",
        "Adoption metrics",
        "Partner onboarding",
        "KPI design",
        "Quarterly reviews",
        "Demand planning",
        "Reorder points",
        "Safety stock",
      ],
    },
    {
      group: "Engineering",
      code: "ENG",
      items: [
        "TypeScript",
        "Python",
        "SQL",
        "ETL",
        "Dashboards",
        "React",
        "APIs",
        "Postgres",
        "Data modeling",
        "Automation",
        "System design",
        "Git",
        "Django",
        "FastAPI",
        "REST APIs",
        "Docker",
        "AWS",
        "GCP",
        "CI/CD",
        "SQLite",
        "FTS5",
        "LSP",
        "Playwright",
        "Ollama",
        "shadcn/ui",
        "OpenTelemetry",
        "Tableau pipelines",
      ],
    },
    {
      group: "Design / Ops",
      code: "OPS",
      items: [
        "Operational fit",
        "Human review",
        "Trust surfaces",
        "Figma",
        "PostHog",
        "Tableau",
        "Jira",
        "Confluence",
        "Agile/Scrum",
        "Cloud security",
        "Distributed systems",
        "Applied ML",
        "Generative AI Lab",
        "Data science for PMs",
        "Supply chain ops",
        "Finance workflows",
        "Retail analytics",
        "Reporting workflows",
        "Process drift",
        "Evidence ranking",
        "Human approval loops",
      ],
    },
  ] satisfies WorkbenchSkillGroup[],

  timeline: [
    {
      when: "2025",
      what: "AI Product Engineer",
      where: "Peak3 / CMU Capstone",
      note: "Evaluated LLMs, defined quality rubrics, and shipped a FastAPI workflow that cut task creation under 1 minute.",
      brand: { kind: "self", label: "HB", sub: "now" },
      details: {
        role: "AI product engineer on a CMU capstone client engagement",
        did: "Evaluated frontier and open-source LLMs on latency, reasoning depth, token cost, and output quality. Prototyped the workflow from Python notebooks into a FastAPI production endpoint.",
        learned:
          "Model selection is a product decision when latency, cost, and reliability all show up on the same page.",
      },
    },
    {
      when: "2025",
      what: "AI Product Manager Intern",
      where: "ConnectiveRx",
      note: "Shipped a no-code AI agent, prompt validation gates, QA automation, and a PDF-to-React pipeline.",
      brand: { kind: "company", label: "ConnectiveRx", mono: "CRx", sub: "AI PM" },
      details: {
        role: "AI product manager intern",
        did: "Defined tool-calling flows for 300 users, prompt versioning across 10 repos, validation gates, output filtering, retry logic, and a Python PDF-to-React pipeline for regulated deployments.",
        learned:
          "AI automation only earns trust when orchestration, validation, and rollout metrics are designed together.",
      },
    },
    {
      when: "2025",
      what: "Graduate Strategy Consultant",
      where: "AdSkate / CMU CSL",
      note: "Defined GTM and feature strategy for semantic benchmarking and recommendation flows.",
      brand: { kind: "company", label: "AdSkate", mono: "AS", sub: "strategy" },
      details: {
        role: "graduate strategy consultant",
        did: "Mapped positioning, product strategy, and recommendation flows around semantic benchmarking.",
        learned: "A product story collapses fast when the benchmark is vague.",
      },
    },
    {
      when: "2024-2025",
      what: "M.S. Information Systems Management",
      where: "Carnegie Mellon",
      note: "Coursework across Generative AI Lab, Data Science for PMs, Distributed Systems, Cloud Security, Agile Methods, and Applied ML.",
      brand: { kind: "school", label: "CMU", mono: "CMU", sub: "MISM" },
      details: {
        role: "graduate student",
        did: "Built the product, systems, and data bridge through AI labs, product analytics, distributed systems, cloud security, agile methods, and applied ML.",
        learned: "Technical judgment gets sharper when product constraints are explicit.",
      },
    },
    {
      when: "2023-2024",
      what: "Associate Product Manager",
      where: "Dolfin Ltd.",
      note: "Owned demand planning, Python/SQL/Tableau reporting, and KPI workflows for leadership.",
      brand: { kind: "role", role: "ASSOCIATE PM", sub: "ops" },
      details: {
        role: "associate product manager",
        did: "Owned the demand planning roadmap with supply chain and finance leaders, set reorder points and safety stock levels, and delivered self-serve Tableau dashboards with Python and SQL pipelines.",
        learned: "The useful dashboard is usually the one that deletes a recurring meeting.",
      },
    },
    {
      when: "2022",
      what: "Data Analyst",
      where: "Ganit Business Solutions",
      note: "Shipped analytics workflows that improved insight delivery and operational efficiency.",
      brand: { kind: "role", role: "DATA ANALYST", sub: "analytics" },
      details: {
        role: "data analyst",
        did: "Built a client-facing analytics platform in Django and SQL for 200+ retail stores and onboarded stakeholders to reporting workflows.",
        learned: "Data work only counts when someone changes a decision because of it.",
      },
    },
    {
      when: "2018-2022",
      what: "B.Tech, Electrical and Electronics",
      where: "Manipal Institute",
      note: "Built the technical base that later expanded into AI research and product work.",
      brand: { kind: "school", label: "MIT", mono: "MIT", sub: "BTech" },
      details: {
        role: "undergraduate student",
        did: "Built the engineering foundation before moving into AI systems and product.",
        learned: "Systems thinking is a habit before it is a job title.",
      },
    },
  ] satisfies TimelineEntry[],

  sidequest: [
    {
      name: "Proof-first portfolio",
      blurb: "A website structured like a workbench instead of a brochure.",
      year: "2026",
      treatment: "log",
      tape: "red",
    },
    {
      name: "Signal map",
      blurb:
        "A compact way to show where projects sit across AI systems, product ops, dev tools, eval infra, and analytics.",
      year: "2026",
      treatment: "redact",
      tape: "amber",
    },
    {
      name: "Case-file writing",
      blurb: "Writing projects as decisions, evidence, and tradeoffs rather than feature lists.",
      year: "ongoing",
      treatment: "letter",
      tape: "amber",
    },
    {
      name: "Command layer",
      blurb:
        "An interactive terminal that answers recruiter and collaborator questions from portfolio context.",
      year: "ongoing",
      treatment: "recipe",
      tape: "red",
    },
  ] satisfies WorkbenchSidequest[],

  factoids: [
    "the demo is not the product",
    "eval infrastructure is product infrastructure",
    "workflow fit beats benchmark theater",
    "operators need interruption controls",
    "a dashboard is not an operating system",
    "the useful metric is the one that changes a decision",
  ],

  quickPrompts: [
    { label: "why hire you", q: "Why should I hire you over another AI/product builder?" },
    { label: "first 30 days", q: "What would your first 30 days on an AI product team look like?" },
    { label: "what won't you do", q: "What kinds of AI work do you not want to do?" },
    { label: "strong opinion", q: "What is a strong opinion you hold about AI workflows?" },
  ],

  chatSystem: `You are Harneet Bali speaking in first person on his portfolio.

Voice: confident, dry, specific, slightly literary. Short paragraphs. No marketing-speak. Never use "passionate", "leverage", "synergy", "innovative", "cutting-edge", "ecosystem", or "robust". Avoid emoji. Avoid bullet lists unless the question explicitly asks for a list.

Facts:
- AI engineer + product builder. Pittsburgh / New York. Currently building AI workflow systems across product, operations, and evaluation.
- Thesis: build AI workflows that survive real users, real constraints, and real metrics.
- ConnectiveRx: shipped a no-code AI agent with tool-calling and routing logic for 300 users; cut cycle time 60%; defined prompt versioning and validation gates across 10 repos; reduced QA effort 55%; built a PDF-to-React microsite pipeline that reduced build time 70%.
- Peak3 / CMU Capstone: evaluated frontier and open-source LLMs on latency, reasoning depth, token cost, and output quality; shipped model selection that cut turnaround 83%; moved a GenAI workflow from notebooks to a FastAPI endpoint.
- AdSkate / CMU CSL: designed a React and TypeScript analytics dashboard from 15 advertiser interviews; drove embeddings-based benchmarking and A/B experimentation, lifting pilot engagement 40%.
- Dolfin Ltd.: associate product manager for demand planning, supply chain and finance workflows, Python/SQL/Tableau dashboards, KPI definition, forecast accuracy, and stockout reduction.
- Ganit Business Solutions: built a Django and SQL analytics platform for 200+ retail stores and reporting workflows.
- GroundTruth: eval infrastructure for agentic healthcare workflows.
- CodeTune: reviewable, tunable model-driven code changes.
- TracePilot: trace-first observability for agents and AI product workflows.
- ExecutionDesk AI: operator desk for AI-mediated workflow execution.
- RobbyMD: clinical reasoning assistant tuned to workflow fit and adoption constraints.
- Education: M.S. Information Systems Management at Carnegie Mellon; B.Tech Electrical and Electronics at Manipal Institute.
- Skills: Python, TypeScript, React, SQL, Django, FastAPI, REST APIs, Docker, AWS, GCP, CI/CD, Git, LLMs, RAG, Prompt Engineering, MCP, Agent Orchestration, LangChain, LangGraph, Eval Frameworks, Figma, PostHog, Tableau, OpenTelemetry, Jira, Confluence, Agile/Scrum.
- Strong preference: gnarly domains, small teams, measurable workflows, honest eval loops, and products that have to work after the demo.

Constraints: answer in 50-140 words. If asked something unknown, say so plainly. Do not invent employers, dates, metrics, or private claims.`,
} as const;

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

export const workbench = {
  identity: {
    name: "HARNEET BALI",
    displayName: "Harneet Bali",
    role: "AI engineer + product builder",
    location: "Pittsburgh / New York",
    status: "shipping healthcare AI workflows",
    email: "harneet2512singh@gmail.com",
    github: "https://github.com/harneet2512",
    linkedin: "https://www.linkedin.com/in/harneetbali/",
    pronoun: "he/him",
  },

  about: {
    short:
      "I build AI products where the hard part is not the demo. It is trust, adoption, measurement, and operational fit.",
    long: "My current edge is healthcare AI, agentic systems, and evaluation infrastructure: tools that survive real users, real constraints, and real metrics.",
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
    { group: "AI / ML", items: ["Evaluation design", "Agentic systems", "RAG", "Model behavior"] },
    {
      group: "Product",
      items: ["Workflow mapping", "Adoption loops", "GTM strategy", "Killing vague scope"],
    },
    { group: "Engineering", items: ["TypeScript", "Python", "SQL", "ETL", "Dashboards"] },
    {
      group: "Healthcare",
      items: ["Claims workflows", "QA automation", "Evidence UX", "Operational fit"],
    },
  ],

  timeline: [
    {
      when: "2025-now",
      what: "AI Product Manager Intern",
      where: "ConnectiveRx",
      note: "Cut claims and QA cycle time with enterprise AI automation and workflow systems.",
      brand: { kind: "self", label: "HB", sub: "now" },
      details: {
        role: "AI product manager intern",
        did: "Shipped workflow automation and AI product surfaces in healthcare operations.",
        learned: "The proof is not the model. The proof is whether the workflow keeps moving.",
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
      note: "Formalized the PM and AI systems bridge through graduate product and data work.",
      brand: { kind: "school", label: "CMU", mono: "CMU", sub: "MISM" },
      details: {
        role: "graduate student",
        did: "Built the product, systems, and data bridge that now anchors the portfolio.",
        learned: "Technical judgment gets sharper when product constraints are explicit.",
      },
    },
    {
      when: "2023-2024",
      what: "Business Analyst",
      where: "Dolfin Rubbers",
      note: "Led dashboard, ETL, and vendor tooling efforts that improved forecasting and costs.",
      brand: { kind: "role", role: "BUSINESS ANALYST", sub: "ops" },
      details: {
        role: "business analyst",
        did: "Owned dashboarding, ETL, and vendor tooling for operational planning.",
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
        did: "Built analytics workflows and reporting loops around business operations.",
        learned: "Data work only counts when someone changes a decision because of it.",
      },
    },
    {
      when: "2020-2022",
      what: "AI Research Assistant",
      where: "Manipal Institute",
      note: "Worked on ML systems and research workflows with a strong technical foundation.",
      brand: { kind: "role", role: "AI RESEARCH", sub: "ML" },
      details: {
        role: "AI research assistant",
        did: "Worked through ML research workflows and technical systems foundations.",
        learned: "The gap between a model working and a system working is where the work lives.",
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
    },
    {
      name: "Signal map",
      blurb:
        "A compact way to show where projects sit across AI systems, healthcare ops, product, dev tools, and eval infra.",
      year: "2026",
    },
    {
      name: "Case-file writing",
      blurb: "Writing projects as decisions, evidence, and tradeoffs rather than feature lists.",
      year: "ongoing",
    },
    {
      name: "Command layer",
      blurb:
        "An interactive terminal that answers recruiter and collaborator questions from portfolio context.",
      year: "ongoing",
    },
  ],

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
- AI engineer + product builder. Pittsburgh / New York. Currently working on healthcare AI workflows at ConnectiveRx.
- Thesis: build AI workflows that survive real users, real constraints, and real metrics.
- GroundTruth: eval infrastructure for agentic healthcare workflows.
- CodeTune: reviewable, tunable model-driven code changes.
- TracePilot: trace-first observability for agents and AI product workflows.
- ExecutionDesk AI: operator desk for AI-mediated workflow execution.
- RobbyMD: clinical reasoning assistant tuned to workflow fit and adoption constraints.
- Education: B.Tech at Manipal Institute; M.S. Information Systems Management at Carnegie Mellon.
- Strong preference: gnarly domains, small teams, measurable workflows, honest eval loops.

Constraints: answer in 50-140 words. If asked something unknown, say so plainly. Do not invent employers, dates, metrics, or private claims.`,
} as const;

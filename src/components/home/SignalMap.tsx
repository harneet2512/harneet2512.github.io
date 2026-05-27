import { Eyebrow } from "@/components/ui/primitives/Eyebrow";

const DOMAINS = [
  "AI Systems",
  "Healthcare Ops",
  "Product Strategy",
  "Developer Tools",
  "Evaluation Infra",
];
const PROJECTS = ["GroundTruth", "CodeTune", "TracePilot", "ExecutionDesk AI", "RobbyMD"];

const MAP: Record<string, Record<string, number>> = {
  GroundTruth: {
    "AI Systems": 2,
    "Healthcare Ops": 2,
    "Product Strategy": 1,
    "Developer Tools": 0,
    "Evaluation Infra": 2,
  },
  CodeTune: {
    "AI Systems": 1,
    "Healthcare Ops": 0,
    "Product Strategy": 1,
    "Developer Tools": 2,
    "Evaluation Infra": 1,
  },
  TracePilot: {
    "AI Systems": 2,
    "Healthcare Ops": 0,
    "Product Strategy": 1,
    "Developer Tools": 2,
    "Evaluation Infra": 2,
  },
  "ExecutionDesk AI": {
    "AI Systems": 2,
    "Healthcare Ops": 1,
    "Product Strategy": 2,
    "Developer Tools": 1,
    "Evaluation Infra": 1,
  },
  RobbyMD: {
    "AI Systems": 2,
    "Healthcare Ops": 2,
    "Product Strategy": 1,
    "Developer Tools": 0,
    "Evaluation Infra": 1,
  },
};

export function SignalMap() {
  return (
    <section className="py-1">
      <div className="flex items-center justify-between gap-4">
        <Eyebrow>Project Signal Map</Eyebrow>
        <span className="font-mono text-[10.5px] text-text-tertiary">5 projects · 5 domains</span>
      </div>

      <div className="mt-5 overflow-x-auto border-y border-border-hair">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-border-hair">
              <th className="w-[28%] py-3 pr-3 text-left">
                <Eyebrow as="span">Project</Eyebrow>
              </th>
              {DOMAINS.map((d) => (
                <th key={d} className="px-3 py-3 text-left">
                  <Eyebrow as="span">{d}</Eyebrow>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p, i) => (
              <tr key={p} className={i < PROJECTS.length - 1 ? "border-b border-border-hair" : ""}>
                <td className="py-3 pr-3 text-[13.5px] text-foreground">{p}</td>
                {DOMAINS.map((d) => {
                  const lvl = MAP[p]?.[d] ?? 0;
                  const bg =
                    lvl === 2
                      ? "var(--accent-sage)"
                      : lvl === 1
                        ? "var(--accent-sage-dim)"
                        : "var(--border-hair)";
                  return (
                    <td key={d} className="px-3 py-3">
                      <span
                        aria-label={`${p} x ${d}: ${lvl}`}
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: bg }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

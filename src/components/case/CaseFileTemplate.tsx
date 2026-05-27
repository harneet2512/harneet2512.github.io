import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { PageHeader } from "@/components/workspace/PageHeader";

type Stage = { label: string; body: string };

export function CaseFileTemplate({
  code,
  title,
  oneLiner,
  stages,
}: {
  code: string;
  title: string;
  oneLiner: string;
  stages: Stage[];
}) {
  return (
    <article className="flex flex-col gap-8">
      <PageHeader eyebrow={`Case file · ${code}`} title={title} dek={oneLiner} />

      <section className="flex flex-col gap-4">
        <Eyebrow>Case progression</Eyebrow>
        <div className="divide-y divide-border-hair border-y border-border-hair">
          {stages.map((s, i) => (
            <div
              key={s.label}
              className="grid gap-4 py-5 md:grid-cols-[64px_minmax(0,1fr)_minmax(220px,0.7fr)]"
            >
              <span className="font-mono text-[13px] text-text-tertiary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-[20px] font-medium leading-tight text-foreground">{s.label}</h2>
              <dl>
                <MetaPair label="Note">{s.body}</MetaPair>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[12.5px] text-text-tertiary">
        Full case study coming. Use the command rail to open another file.
      </p>
    </article>
  );
}

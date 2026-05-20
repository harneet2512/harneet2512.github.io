import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { RowCard } from "@/components/ui/primitives/RowCard";
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
      <PageHeader
        eyebrow={`Case file · ${code}`}
        title={title}
        dek={oneLiner}
      />

      <section className="flex flex-col gap-3">
        <Eyebrow>Case progression</Eyebrow>
        <div className="flex flex-col gap-3">
          {stages.map((s, i) => (
            <RowCard
              key={s.label}
              number={String(i + 1).padStart(2, "0")}
              title={
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-sans text-[15px] font-medium leading-tight tracking-[-0.005em] text-foreground">
                    {s.label}
                  </h2>
                </div>
              }
              meta={
                <dl>
                  <MetaPair label="Note">{s.body}</MetaPair>
                </dl>
              }
            />
          ))}
        </div>
      </section>

      <p className="text-[12.5px] text-text-tertiary">
        Full case study coming. Use the command rail to open another file.
      </p>
    </article>
  );
}

import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { MetaPair } from "@/components/ui/primitives/MetaPair";
import { PageHeader } from "@/components/workspace/PageHeader";

type Stage = { label: string; body: string };
type Demo = {
  kind: "image" | "gif" | "video";
  src: string;
  alt: string;
  label: string;
  repo: string;
};

export function CaseFileTemplate({
  code,
  title,
  oneLiner,
  stages,
  demo,
}: {
  code: string;
  title: string;
  oneLiner: string;
  stages: Stage[];
  demo?: Demo;
}) {
  return (
    <article className="flex flex-col gap-8">
      <PageHeader eyebrow={`Case file / ${code}`} title={title} dek={oneLiner} />

      {demo && (
        <figure className="overflow-hidden border border-border-hair bg-surface-subtle">
          <div className="aspect-video bg-black/5">
            {demo.kind === "video" ? (
              <video
                className="h-full w-full object-cover"
                controls
                muted
                playsInline
                preload="metadata"
                src={demo.src}
                aria-label={demo.alt}
              />
            ) : (
              <img
                className="h-full w-full object-cover"
                src={demo.src}
                alt={demo.alt}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-border-hair px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{demo.label}</span>
            <a className="text-sage" href={demo.repo} target="_blank" rel="noreferrer">
              open repo
            </a>
          </figcaption>
        </figure>
      )}

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

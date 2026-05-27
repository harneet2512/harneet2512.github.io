import { cn } from "@/lib/utils";

type RowCardProps = {
  number?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  artifact?: React.ReactNode;
  action?: React.ReactNode;
  accent?: string;
  className?: string;
};

export function RowCard({
  number,
  title,
  meta,
  artifact,
  action,
  accent,
  className,
}: RowCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-row border border-border-line bg-surface-card transition-colors duration-200 hover:border-border-strong",
        className,
      )}
    >
      {accent && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[2px] opacity-50 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: accent }}
        />
      )}
      <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[48px_minmax(210px,1fr)_minmax(190px,0.9fr)_260px] lg:items-center lg:gap-6 lg:p-6 lg:pb-10">
        {number && <div className="font-mono text-[13px] text-text-tertiary">{number}</div>}
        <div className="min-w-0">{title}</div>
        {meta && <div className="min-w-0">{meta}</div>}
        {artifact && (
          <div className="flex items-center justify-start lg:justify-center">{artifact}</div>
        )}
        {action && (
          <div className="flex items-center lg:absolute lg:bottom-5 lg:right-6">{action}</div>
        )}
      </div>
    </article>
  );
}

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
        "shadow-card group relative overflow-hidden rounded-[12px] bg-surface-card transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-card-hover",
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
      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[48px_1fr_1fr_280px_110px] lg:items-center lg:gap-8 lg:p-6">
        {number && (
          <div className="font-mono text-[13px] text-text-tertiary">{number}</div>
        )}
        <div className="min-w-0">{title}</div>
        {meta && <div className="min-w-0">{meta}</div>}
        {artifact && (
          <div className="flex items-center justify-start lg:justify-center">{artifact}</div>
        )}
        {action && (
          <div className="flex items-center lg:justify-end">{action}</div>
        )}
      </div>
    </article>
  );
}

import { Eyebrow } from "@/components/ui/primitives/Eyebrow";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  dek?: string;
  rightSlot?: React.ReactNode;
};

/**
 * Shared page header. Composes Eyebrow + H1 + dek on top of a hairline.
 * Page-level chrome only; assumes <PageBreadcrumb /> renders above it in __root.
 */
export function PageHeader({ eyebrow, title, dek, rightSlot }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border-hair pb-6">
      <div className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 flex-col gap-3">
          {eyebrow && <Eyebrow dot>{eyebrow}</Eyebrow>}
          <h1 className="font-sans text-[42px] font-semibold leading-[1.08] text-foreground md:text-[48px]">
            {title}
          </h1>
          {dek && (
            <p className="max-w-[62ch] text-[14px] leading-[1.55] text-text-secondary">{dek}</p>
          )}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </header>
  );
}

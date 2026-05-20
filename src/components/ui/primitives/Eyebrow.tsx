import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  dot = false,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  as?: "span" | "div" | "h2" | "h3" | "dt";
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary",
        className,
      )}
    >
      {children}
      {dot && <span className="h-[6px] w-[6px] rounded-full bg-sage" aria-hidden />}
    </Tag>
  );
}

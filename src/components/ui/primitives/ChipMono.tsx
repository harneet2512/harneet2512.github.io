import { cn } from "@/lib/utils";

type ChipMonoProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function ChipMono({ children, className, ...rest }: ChipMonoProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip border border-border-hair bg-transparent px-2.5 py-1 font-mono text-[12px] text-text-secondary transition-colors duration-200 hover:border-border-line hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

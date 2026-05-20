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
        "inline-flex items-center gap-1.5 rounded-[8px] bg-surface-card px-3 py-1.5 font-mono text-[12px] text-text-secondary transition-all duration-200 hover:bg-surface-raised hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

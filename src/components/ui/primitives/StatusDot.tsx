import { cn } from "@/lib/utils";

const TONES = {
  sage: "bg-sage",
  warn: "bg-warn",
  dim: "bg-text-tertiary",
} as const;

export function StatusDot({
  tone = "sage",
  className,
}: {
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-[6px] w-[6px] rounded-full", TONES[tone], className)}
    />
  );
}

import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export function MetaPair({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Eyebrow as="dt">{label}</Eyebrow>
      <dd className="text-[12.5px] leading-[1.55] text-text-secondary">{children}</dd>
    </div>
  );
}

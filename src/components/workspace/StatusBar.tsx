import { StatusDot } from "@/components/ui/primitives/StatusDot";

export function StatusBar() {
  return (
    <footer className="grid h-7 shrink-0 grid-cols-[1fr_auto] items-center gap-3 border-t border-border-hair bg-surface-inset px-4 text-[11px] text-text-tertiary md:grid-cols-[1fr_auto_1fr] md:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <StatusDot tone="sage" />
        <span className="truncate text-text-secondary">Workspace ready</span>
      </div>
      <div className="hidden min-w-0 truncate text-center font-mono md:block">
        Workspace initialized · 5 projects indexed · Command layer ready
      </div>
      <div className="min-w-0 truncate text-right font-mono">⌘K to focus · online</div>
    </footer>
  );
}

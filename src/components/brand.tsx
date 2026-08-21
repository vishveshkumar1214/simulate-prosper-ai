import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-[5px] bg-primary font-mono text-[11px] font-semibold text-primary-foreground",
        className,
      )}
    >
      AI
    </span>
  );
}

export function BrandLock({ to = "/", compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="flex min-w-0 items-center gap-2">
      <BrandMark />
      <span className="truncate text-sm font-semibold tracking-tight">
        {compact ? "Multi-Agent Sim" : "AI Multi-Agent Business Simulator"}
      </span>
    </Link>
  );
}

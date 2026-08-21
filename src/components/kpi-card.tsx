import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  direction?: "up" | "down" | "flat";
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, delta, direction = "flat", icon, className }: KpiCardProps) {
  const Arrow = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  return (
    <div className={cn("rounded-xl border bg-card p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="label-mono">{label}</span>
        {icon ? <span className="shrink-0 text-muted-foreground">{icon}</span> : null}
      </div>
      <p className="mt-3 font-mono text-2xl tracking-tight text-card-foreground">{value}</p>
      {delta ? (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-[11px] font-medium",
            direction === "up" && "text-brand",
            direction === "down" && "text-destructive",
            direction === "flat" && "text-muted-foreground",
          )}
        >
          <Arrow className="size-3 shrink-0" aria-hidden />
          {delta}
        </p>
      ) : null}
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-7 w-28" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  );
}

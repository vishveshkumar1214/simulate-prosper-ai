import { cn } from "@/lib/utils";
import type { AgentStatus, SimulationStatus } from "@/data/types";

type Tone = "brand" | "muted" | "warning" | "destructive" | "info";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand",
  muted: "bg-muted text-muted-foreground",
  warning: "bg-warning-soft text-warning",
  destructive: "bg-destructive-soft text-destructive",
  info: "bg-info-soft text-info",
};

export function StatusPill({
  label,
  tone = "muted",
  pulse = false,
  className,
}: {
  label: string;
  tone?: Tone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em]",
        toneClasses[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full bg-current",
          pulse && "animate-[status-pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]",
        )}
      />
      {label}
    </span>
  );
}

const agentTone: Record<AgentStatus, Tone> = {
  thinking: "info",
  analyzing: "brand",
  completed: "brand",
  waiting: "muted",
  warning: "destructive",
};

export function AgentStatusPill({ status }: { status: AgentStatus }) {
  return (
    <StatusPill
      label={status}
      tone={agentTone[status]}
      pulse={status === "thinking" || status === "analyzing"}
    />
  );
}

const simTone: Record<SimulationStatus, Tone> = {
  running: "brand",
  completed: "info",
  draft: "muted",
  failed: "destructive",
  archived: "muted",
};

export function SimulationStatusPill({ status }: { status: SimulationStatus }) {
  return <StatusPill label={status} tone={simTone[status]} pulse={status === "running"} />;
}

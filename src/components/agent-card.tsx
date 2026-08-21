import { cn } from "@/lib/utils";
import { AgentStatusPill } from "@/components/status-badge";
import type { Agent } from "@/data/types";

export function AgentCard({ agent, className }: { agent: Agent; className?: string }) {
  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
          {agent.code}
        </span>
        <AgentStatusPill status={agent.status} />
      </div>
      <h3 className="mt-4 text-sm font-semibold">{agent.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{agent.role}</p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{agent.description}</p>
    </article>
  );
}

export function AgentWorkCard({ agent }: { agent: Agent }) {
  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{agent.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{agent.role}</p>
        </div>
        <AgentStatusPill status={agent.status} />
      </div>

      <dl className="mt-4 space-y-3 border-t pt-4">
        <div>
          <dt className="label-mono">Current task</dt>
          <dd className="mt-1 text-xs leading-relaxed">{agent.currentTask}</dd>
        </div>
        <div>
          <dt className="label-mono">Decision</dt>
          <dd className="mt-1 text-xs leading-relaxed">{agent.decision}</dd>
        </div>
        <div>
          <dt className="label-mono">Business impact</dt>
          <dd
            className={cn(
              "mt-1 font-mono text-xs",
              agent.impactDirection === "positive" && "text-brand",
              agent.impactDirection === "negative" && "text-destructive",
              agent.impactDirection === "neutral" && "text-muted-foreground",
            )}
          >
            {agent.impact}
          </dd>
        </div>
      </dl>
    </article>
  );
}

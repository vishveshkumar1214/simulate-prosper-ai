import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, BarChart3, FileText, History, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell, PageIntro } from "@/components/marketing/shell";
import { AgentCard } from "@/components/agent-card";
import { mock } from "@/data/service";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — AI Multi-Agent Business Simulator" },
      {
        name: "description",
        content:
          "Multi-agent simulation, real-time KPIs, business analytics, AI recommendations, simulation history and automated reports.",
      },
      { property: "og:title", content: "Features — AI Multi-Agent Business Simulator" },
      {
        property: "og:description",
        content: "Everything the platform gives your strategy team, from agents to board-ready reports.",
      },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  {
    icon: Users,
    title: "Multi-agent simulation",
    body: "Eight role-specific agents each hold a mandate — capital, demand, delivery, risk — and negotiate every round rather than agreeing by default.",
  },
  {
    icon: Activity,
    title: "Real-time KPIs",
    body: "Revenue, profit, cash flow, customers, market share and risk recompute the moment a round resolves.",
  },
  {
    icon: BarChart3,
    title: "Business analytics",
    body: "Round-level charts and comparisons designed to answer 'which lever moved this?', not to fill a dashboard.",
  },
  {
    icon: Lightbulb,
    title: "AI recommendations",
    body: "Prioritised, concrete next actions with the projected impact of taking or deferring each one.",
  },
  {
    icon: History,
    title: "Simulation history",
    body: "Search, filter and sort every scenario you've run, with full results preserved for later comparison.",
  },
  {
    icon: FileText,
    title: "Automated reports",
    body: "An executive report assembled from each run — summary, financials, operations, risks and recommendations.",
  },
];

function FeaturesPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Features"
        title="Everything needed to defend a decision"
        description="The platform is built around one job: turning an uncertain business choice into evidence you can put in front of a board."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="rounded-xl border bg-card p-6">
                <f.icon className="size-4 text-brand" aria-hidden />
                <h2 className="mt-4 text-sm font-semibold">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-medium tracking-tight">The agent roster</h2>
          <p className="mt-2 max-w-[56ch] text-muted-foreground">
            Each agent reports a task, a decision and a business impact — never raw internal
            reasoning.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mock.agents.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
          <Button asChild variant="brand" className="mt-10">
            <Link to="/signup">Start Free Trial</Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
}

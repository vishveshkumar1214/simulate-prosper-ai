import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MarketingShell, PageIntro } from "@/components/marketing/shell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — AI Multi-Agent Business Simulator" },
      {
        name: "description",
        content:
          "Create a scenario, let eight AI agents collaborate, simulate the business round by round, then analyze the results.",
      },
      { property: "og:title", content: "How It Works — AI Multi-Agent Business Simulator" },
      {
        property: "og:description",
        content: "From blank scenario to board-ready analysis in four steps.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    n: "01",
    title: "Create scenario",
    body: "Describe the business, market conditions, budget, goals and risk appetite. The seven-step builder keeps the inputs structured so results stay comparable across runs.",
    detail: ["Business type & industry", "Company size & budget", "Market size & competition", "Growth goal & risk tolerance"],
  },
  {
    n: "02",
    title: "AI agents collaborate",
    body: "Eight specialised agents take positions from their own mandate. Conflicts surface as trade-offs rather than being averaged away.",
    detail: ["Each agent proposes a decision", "Conflicts resolved by the CEO agent", "Risk agent holds a veto flag", "Every choice logged with its rationale"],
  },
  {
    n: "03",
    title: "Simulate business",
    body: "The engine plays out the decisions round by round, injecting market events so the plan meets reality rather than a spreadsheet.",
    detail: ["Configurable round count", "Live KPI updates", "Market events & shocks", "Decision checkpoints"],
  },
  {
    n: "04",
    title: "Analyze results",
    body: "Results arrive as an executive package: what happened, what drove it, what it risks and what to do next.",
    detail: ["Executive summary", "Key decisions log", "Positive & negative impacts", "Risks and recommendations"],
  },
];

function HowItWorksPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="How it works"
        title="Four steps, one defensible answer"
        description="The workflow is deliberately linear. Structured inputs in, comparable evidence out."
      />

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <ol className="space-y-px overflow-hidden rounded-xl border bg-border">
            {steps.map((s) => (
              <li key={s.n} className="grid gap-6 bg-card p-8 md:grid-cols-[auto_1fr_1fr]">
                <span className="font-mono text-xs text-brand">{s.n}</span>
                <div>
                  <h2 className="text-lg font-medium tracking-tight">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
                <ul className="space-y-2 md:border-l md:pl-6">
                  {s.detail.map((d) => (
                    <li key={d} className="text-sm text-muted-foreground">
                      {d}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Button asChild variant="brand" size="lg">
              <Link to="/app/simulations/new">Create your first scenario</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

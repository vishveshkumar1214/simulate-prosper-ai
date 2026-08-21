import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  ClipboardList,
  FileText,
  History,
  LineChart,
  Lightbulb,
  Play,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarketingShell } from "@/components/marketing/shell";
import { ConsolePreview } from "@/components/marketing/console-preview";
import { AgentCard } from "@/components/agent-card";
import { StatusPill } from "@/components/status-badge";
import { mock } from "@/data/service";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Multi-Agent Business Simulator — Simulate. Analyze. Decide. Grow." },
      {
        name: "description",
        content:
          "Model business decisions with eight specialised AI agents. Run scenarios, track KPIs and get executive-ready analysis before you commit capital.",
      },
      {
        property: "og:title",
        content: "AI Multi-Agent Business Simulator — Simulate. Analyze. Decide. Grow.",
      },
      {
        property: "og:description",
        content:
          "Eight AI business agents simulate realistic decisions and outcomes. Start a 30-day free trial.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Create scenario",
    body: "Define the business, market, budget, goals and risk appetite in a guided seven-step builder.",
  },
  {
    n: "02",
    title: "AI agents collaborate",
    body: "Eight specialised agents negotiate decisions round by round, each defending its own mandate.",
  },
  {
    n: "03",
    title: "Simulate business",
    body: "Watch KPIs, market events and agent decisions unfold live in the simulation workspace.",
  },
  {
    n: "04",
    title: "Analyze results",
    body: "Get an executive summary, decision log, risk register and actionable recommendations.",
  },
];

const features = [
  { icon: Users, title: "Multi-agent simulation", body: "Eight role-specific agents debate and commit to decisions each round." },
  { icon: Activity, title: "Real-time KPIs", body: "Revenue, profit, customers, market share and risk update as rounds resolve." },
  { icon: BarChart3, title: "Business analytics", body: "Compare rounds, scenarios and levers with charts built for decisions, not decoration." },
  { icon: Lightbulb, title: "AI recommendations", body: "Concise, prioritised next actions grounded in what the simulation actually showed." },
  { icon: History, title: "Simulation history", body: "Search, filter and revisit every scenario with its full result set intact." },
  { icon: FileText, title: "Automated reports", body: "Board-ready reports assembled automatically and exportable as PDF." },
];

const dashboardKpis = [
  { label: "Revenue projection", value: "$4.2M", note: "+12.4% vs baseline", tone: "brand" as const },
  { label: "Net profit", value: "$842K", note: "Optimum margin", tone: "brand" as const },
  { label: "Customers", value: "42,091", note: "CAC down 11%", tone: "brand" as const },
  { label: "Market share", value: "18.2%", note: "Tier 2 position", tone: "muted" as const },
  { label: "Risk score", value: "0.24", note: "Within tolerance", tone: "muted" as const },
];

function Landing() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label-mono">AI Multi-Agent Business Simulator</p>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
                Simulate. Analyze. Decide. Grow.
              </h1>
              <p className="mt-6 max-w-[42ch] text-pretty text-lg text-muted-foreground">
                Orchestrate eight AI business agents to model realistic decisions and outcomes.
                Gain predictive clarity before committing capital.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="brand" size="lg">
                  <Link to="/signup">
                    <Play className="size-4" aria-hidden />
                    Start Free Trial
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/app">Explore Demo</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                30-day free trial · No card required
              </p>
            </div>

            <div className="lg:col-span-7">
              <ConsolePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="border-t py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-balance text-3xl font-medium tracking-tight">
                Autonomous specialized agents
              </h2>
              <p className="mt-2 max-w-[56ch] text-pretty text-muted-foreground">
                Eight AI personas collaborating inside your private business environment.
              </p>
            </div>
            <span className="label-mono">Active instance: 0x82f1</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mock.agents.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-balance text-3xl font-medium tracking-tight">How it works</h2>
          <p className="mt-2 max-w-[56ch] text-pretty text-muted-foreground">
            Four steps from a blank scenario to a decision you can defend.
          </p>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="bg-card p-6">
                <span className="font-mono text-xs text-brand">{s.n}</span>
                <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-balance text-3xl font-medium tracking-tight">
            Built for business decisions
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-6">
                <f.icon className="size-4 text-brand" aria-hidden />
                <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulation preview */}
      <section className="border-t bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-balance text-3xl font-medium tracking-tight">
              Dense intelligence. Zero clutter.
            </h2>
            <p className="mt-3 max-w-[48ch] text-pretty text-muted-foreground">
              The dashboard translates thousands of agent operations into five business vectors.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dashboardKpis.map((k) => (
              <div key={k.label} className="rounded-xl border bg-card p-6">
                <p className="label-mono">{k.label}</p>
                <p className="mt-4 font-mono text-2xl tracking-tight">{k.value}</p>
                <p
                  className={
                    k.tone === "brand"
                      ? "mt-2 text-[11px] font-medium text-brand"
                      : "mt-2 text-[11px] font-medium text-muted-foreground"
                  }
                >
                  {k.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Round-by-round trajectory</h3>
                <span className="label-mono">Rounds 1–14</span>
              </div>
              <div className="mt-6 flex h-40 items-end gap-1.5" aria-hidden>
                {mock.series.map((p, i) => (
                  <div
                    key={p.round}
                    className="flex-1 rounded-t-sm bg-brand/25 ring-1 ring-inset ring-brand/40"
                    style={{ height: `${28 + i * 5}%` }}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Revenue compounding as pricing and retention decisions land.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-sm font-semibold">Agent activity</h3>
              <ul className="mt-4 space-y-3">
                {mock.activity.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{a.agent}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.message}</p>
                    </div>
                    <span className="label-mono shrink-0">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <StatusPill label="30-day free trial" tone="brand" />
            <h2 className="mt-4 text-balance text-3xl font-medium tracking-tight">
              Pricing that scales with your scenarios
            </h2>
            <p className="mt-3 max-w-[48ch] text-pretty text-muted-foreground">
              Every plan starts with a 30-day trial. A paid subscription is required afterwards to
              keep premium features.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {mock.plans.map((p) => (
              <div
                key={p.id}
                className={
                  p.featured
                    ? "rounded-xl border-2 border-foreground bg-card p-8"
                    : "rounded-xl border bg-card p-8"
                }
              >
                <div className="flex items-center justify-between">
                  <p className="label-mono">{p.name}</p>
                  {p.featured ? <StatusPill label="Most popular" tone="brand" /> : null}
                </div>
                <p className="mt-5 font-mono text-4xl tracking-tight">
                  ${p.price}
                  <span className="text-base text-muted-foreground">/mo</span>
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-brand" aria-hidden>
                        ·
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={p.featured ? "brand" : "outline"}
                  className="mt-8 w-full"
                >
                  <Link to="/signup">{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-balance text-3xl font-medium tracking-tight">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {mock.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-3xl font-medium tracking-tight">
            Ready to stress-test your strategy?
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Start your 30-day free trial and model your first scenario in under ten minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link to="/app/simulations/new">
                <ClipboardList className="size-4" aria-hidden />
                Build a scenario
              </Link>
            </Button>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LineChart className="size-3.5" aria-hidden />
            Used by strategy teams to pressure-test pricing, hiring and expansion.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}

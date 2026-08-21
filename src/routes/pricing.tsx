import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarketingShell, PageIntro } from "@/components/marketing/shell";
import { StatusPill } from "@/components/status-badge";
import { mock } from "@/data/service";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AI Multi-Agent Business Simulator" },
      {
        name: "description",
        content:
          "Starter, Professional and Business plans. Every plan includes a 30-day free trial with full Professional features.",
      },
      { property: "og:title", content: "Pricing — AI Multi-Agent Business Simulator" },
      {
        property: "og:description",
        content: "Three plans, one 30-day free trial, no card required to start.",
      },
    ],
  }),
  component: PricingPage,
});

function Cell({ value }: { value: string }) {
  if (value === "—")
    return (
      <span className="text-muted-foreground">
        <Minus className="size-3.5" aria-label="Not included" />
      </span>
    );
  if (value === "Included")
    return (
      <span className="text-brand">
        <Check className="size-3.5" aria-label="Included" />
      </span>
    );
  return <span className="font-mono text-xs">{value}</span>;
}

function PricingPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Pricing"
        title="Start free for 30 days"
        description="Full Professional features during the trial. After it ends a paid subscription is required to keep premium features — nothing is charged automatically."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {mock.plans.map((p) => (
              <article
                key={p.id}
                className={
                  p.featured
                    ? "rounded-xl border-2 border-foreground bg-card p-8"
                    : "rounded-xl border bg-card p-8"
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="label-mono">{p.name}</h2>
                  {p.featured ? <StatusPill label="Most popular" tone="brand" /> : null}
                </div>
                <p className="mt-5 font-mono text-4xl tracking-tight">
                  ${p.price}
                  <span className="text-base text-muted-foreground">/mo</span>
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={p.featured ? "brand" : "outline"} className="mt-8 w-full">
                  <Link to="/signup">{p.cta}</Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-medium tracking-tight">Compare plans</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-48">Capability</TableHead>
                  <TableHead>Starter</TableHead>
                  <TableHead>Professional</TableHead>
                  <TableHead>Business</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mock.featureComparison.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell>
                      <Cell value={row.starter} />
                    </TableCell>
                    <TableCell>
                      <Cell value={row.professional} />
                    </TableCell>
                    <TableCell>
                      <Cell value={row.business} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className="border-t py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-medium tracking-tight">Billing questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {mock.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </MarketingShell>
  );
}

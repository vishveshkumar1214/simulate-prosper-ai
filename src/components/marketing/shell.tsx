import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b py-16">
      <div className="mx-auto max-w-7xl px-6">
        <p className="label-mono">{eyebrow}</p>
        <h1 className="mt-3 max-w-[20ch] text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-[62ch] text-pretty text-lg text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}

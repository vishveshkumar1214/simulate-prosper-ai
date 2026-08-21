import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="text-sm font-semibold tracking-tight">Multi-Agent Simulator</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <p className="label-mono">Account</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}

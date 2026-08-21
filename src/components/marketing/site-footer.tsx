import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Platform",
    links: [
      { to: "/app", label: "Dashboard" },
      { to: "/app/history", label: "Simulation History" },
      { to: "/app/reports", label: "Reports" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Login" },
      { to: "/signup", label: "Sign Up" },
      { to: "/forgot-password", label: "Reset Password" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <BrandMark />
              <span className="text-sm font-semibold tracking-tight">
                AI Multi-Agent Business Simulator
              </span>
            </div>
            <p className="mt-4 max-w-[34ch] text-sm text-muted-foreground">
              Simulate. Analyze. Decide. Grow. High-fidelity business simulation for teams that
              have to be right before they commit.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 md:col-span-8">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3">
                <h2 className="label-mono">{col.title}</h2>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center">
          <p className="label-mono">© 2026 Multi-Agent Simulation Labs</p>
          <p className="label-mono flex items-center gap-2">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-brand animate-[status-pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
            />
            System status: operational
          </p>
        </div>
      </div>
    </footer>
  );
}

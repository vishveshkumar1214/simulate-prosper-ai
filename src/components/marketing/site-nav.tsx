import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/features/auth/auth-context";

const links = [
  { to: "/movies", label: "Movies" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <BrandMark />
            <span className="truncate text-sm font-semibold tracking-tight">
              Multi-Agent Simulator
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/bookings">My Bookings</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => void signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/bookings" onClick={() => setOpen(false)}>
                      My Bookings
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      void signOut();
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/features/auth/auth-context";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Login — AI Multi-Agent Business Simulator" },
      { name: "description", content: "Sign in to your simulation workspace." },
      { property: "og:title", content: "Login — AI Multi-Agent Business Simulator" },
      { property: "og:description", content: "Sign in to your simulation workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Signed in", { description: "Welcome back." });
      // `redirect` carries an in-app path captured before the sign-in detour.
      await navigate({ to: (redirect ?? "/movies") as "/movies" });
    } catch (error) {
      toast.error("Sign in failed", { description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      description="Access your simulations, reports and agent workspace."
      footer={
        <>
          No account yet?{" "}
          <Link to="/signup" className="font-medium text-foreground underline underline-offset-4">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={(e) => void submit(e)} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Work email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
          {errors.email ? (
            <p id="login-email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password ? (
            <p id="login-password-error" className="text-xs text-destructive">
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Keep me signed in
          </Label>
        </div>

        <Button type="submit" variant="brand" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {loading ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

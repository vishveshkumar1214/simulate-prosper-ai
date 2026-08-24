import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell } from "@/components/auth/auth-shell";
import { StatusPill } from "@/components/status-badge";
import { useAuth } from "@/features/auth/auth-context";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Create your account — AI Multi-Agent Business Simulator" },
      {
        name: "description",
        content: "Start a 30-day free trial of the AI Multi-Agent Business Simulator.",
      },
      { property: "og:title", content: "Create your account — AI Multi-Agent Business Simulator" },
      { property: "og:description", content: "Start your 30-day free trial. No card required." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
}

function SignupPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = "Enter a valid work email.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (!terms) next.terms = "You must accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Check the highlighted fields");
      return;
    }
    setLoading(true);
    try {
      const session = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.name.trim(),
      });
      if (session) {
        toast.success("Account created", { description: "You're signed in." });
        // `redirect` carries an in-app path captured before the sign-up detour.
        await navigate({ to: (redirect ?? "/movies") as "/movies" });
      } else {
        toast.success("Account created", { description: "Verify your email to finish setup." });
        await navigate({ to: "/verify-email" });
      }
    } catch (error) {
      toast.error("Sign up failed", { description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      description="30-day free trial with full Professional features. No card required."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <StatusPill label="30-day free trial" tone="brand" className="mb-6" />
      <form onSubmit={(e) => void submit(e)} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="su-name">Full name</Label>
          <Input
            id="su-name"
            value={form.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-email">Work email</Label>
          <Input
            id="su-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            placeholder="you@company.com"
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-company">Company (optional)</Label>
          <Input id="su-company" value={form.company} onChange={set("company")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-password">Password</Label>
          <Input
            id="su-password"
            type="password"
            value={form.password}
            onChange={set("password")}
            aria-invalid={!!errors.password}
          />
          <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
          {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="su-terms"
            checked={terms}
            onCheckedChange={(v) => setTerms(v === true)}
            aria-invalid={!!errors.terms}
          />
          <Label
            htmlFor="su-terms"
            className="text-sm font-normal leading-snug text-muted-foreground"
          >
            I agree to the terms of service and privacy policy.
          </Label>
        </div>
        {errors.terms ? <p className="text-xs text-destructive">{errors.terms}</p> : null}

        <Button type="submit" variant="brand" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {loading ? "Creating account" : "Start free trial"}
        </Button>
      </form>
    </AuthShell>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — AI Multi-Agent Business Simulator" },
      { name: "description", content: "Request a password reset link for your account." },
      { property: "og:title", content: "Reset password — AI Multi-Agent Business Simulator" },
      { property: "og:description", content: "Request a password reset link for your account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Reset link sent");
    }, 700);
  };

  return (
    <AuthShell
      title="Reset your password"
      description="We'll email a secure link that lets you set a new password."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-xl border bg-card p-6 text-center">
          <CheckCircle2 className="mx-auto size-5 text-brand" aria-hidden />
          <h2 className="mt-3 text-sm font-semibold">Check your inbox</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for {email}, a reset link is on its way. The link expires in 30
            minutes.
          </p>
          <Button variant="outline" className="mt-5 w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fp-email">Work email</Label>
            <Input
              id="fp-email"
              type="email"
              value={email}
              aria-invalid={!!error}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>
          <Button type="submit" variant="brand" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {loading ? "Sending" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

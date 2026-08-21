import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthShell } from "@/components/auth/auth-shell";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — AI Multi-Agent Business Simulator" },
      { name: "description", content: "Enter the six-digit code we sent to confirm your email." },
      { property: "og:title", content: "Verify your email — AI Multi-Agent Business Simulator" },
      { property: "og:description", content: "Confirm your email to activate your trial." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter all six digits.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("Email verified", { description: "Your 30-day trial is active." });
      navigate({ to: "/app" });
    }, 700);
  };

  return (
    <AuthShell
      title="Verify your email"
      description="We sent a six-digit code to alex@northwind.io. It expires in 10 minutes."
      footer={
        <>
          Wrong address?{" "}
          <Link to="/signup" className="font-medium text-foreground underline underline-offset-4">
            Change it
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}

        <Button type="submit" variant="brand" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <MailCheck className="size-4" aria-hidden />}
          {loading ? "Verifying" : "Verify email"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => toast.info("A new code is on its way")}
        >
          Resend code
        </Button>
      </form>
    </AuthShell>
  );
}

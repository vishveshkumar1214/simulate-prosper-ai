import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";

import { MarketingShell } from "@/components/marketing/shell";
import { ErrorState, LoadingBlock } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { rupees, showDay, showTime } from "@/lib/format";
import { bookingKeys, cancelBooking, getBooking, payBooking } from "@/features/booking/api";

export const Route = createFileRoute("/checkout/$bookingId")({
  component: CheckoutPage,
});

const methods = [
  { id: "card", label: "Credit / debit card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

function CheckoutPage() {
  const { bookingId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [method, setMethod] = useState("card");

  const booking = useQuery({
    queryKey: bookingKeys.booking(bookingId),
    queryFn: () => getBooking(bookingId),
  });

  const pay = useMutation({
    mutationFn: (succeed: boolean) => payBooking({ bookingId, method, succeed }),
    onSuccess: (status) => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings });
      void queryClient.invalidateQueries({ queryKey: bookingKeys.booking(bookingId) });
      if (status === "succeeded") {
        void navigate({ to: "/bookings/$bookingId", params: { bookingId } });
      } else {
        toast.error("Payment declined", {
          description: "The simulated gateway rejected this payment and the seats were released.",
        });
      }
    },
    onError: (error: Error) => toast.error("Payment failed", { description: error.message }),
  });

  const release = useMutation({
    mutationFn: () => cancelBooking(bookingId),
    onSuccess: () => {
      toast.success("Seats released");
      void navigate({ to: "/movies" });
    },
    onError: (error: Error) => toast.error("Couldn't cancel", { description: error.message }),
  });

  if (booking.isPending) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <LoadingBlock label="Loading your order" />
        </div>
      </MarketingShell>
    );
  }

  if (booking.isError) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <ErrorState title="Booking not found" description={booking.error.message} />
        </div>
      </MarketingShell>
    );
  }

  const order = booking.data;
  const seats = order.booking_seats
    .map((row) => `${row.seats.row_label}${row.seats.seat_number}`)
    .sort();
  const settled = order.status !== "pending";

  return (
    <MarketingShell>
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="label-mono">Checkout</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">Confirm and pay</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Booking {order.booking_code} · seats are held until payment completes.
          </p>

          <div className="mt-8 rounded-xl border bg-card p-6">
            <h2 className="text-sm font-semibold">{order.shows.movies.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.shows.screens.theatres.name} · {order.shows.screens.name} ·{" "}
              {showDay(order.shows.starts_at)} at {showTime(order.shows.starts_at)}
            </p>
            <p className="mt-3 text-sm">
              <span className="text-muted-foreground">Seats: </span>
              {seats.join(", ")}
            </p>

            <dl className="mt-6 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{rupees(Number(order.subtotal_amount))}</dd>
              </div>
              {Number(order.discount_amount) > 0 ? (
                <div className="flex justify-between text-brand">
                  <dt>Coupon discount</dt>
                  <dd className="tabular-nums">-{rupees(Number(order.discount_amount))}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Convenience fee (5%)</dt>
                <dd className="tabular-nums">{rupees(Number(order.convenience_fee))}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{rupees(Number(order.total_amount))}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 rounded-xl border bg-card p-6">
            <h2 className="text-sm font-semibold">Payment method</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              This is a simulated gateway for the demo — no real money moves and no card details are
              collected.
            </p>

            <RadioGroup value={method} onValueChange={setMethod} className="mt-4 space-y-2">
              {methods.map((option) => (
                <div key={option.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <RadioGroupItem value={option.id} id={`method-${option.id}`} />
                  <option.icon className="size-4 text-muted-foreground" aria-hidden />
                  <Label htmlFor={`method-${option.id}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="brand"
                disabled={settled || pay.isPending || release.isPending}
                onClick={() => pay.mutate(true)}
              >
                {pay.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ShieldCheck className="size-4" aria-hidden />
                )}
                Pay {rupees(Number(order.total_amount))}
              </Button>
              <Button
                variant="outline"
                disabled={settled || pay.isPending || release.isPending}
                onClick={() => pay.mutate(false)}
              >
                Simulate failed payment
              </Button>
              <Button
                variant="ghost"
                disabled={settled || pay.isPending || release.isPending}
                onClick={() => release.mutate()}
              >
                Cancel and release seats
              </Button>
            </div>

            {settled ? (
              <p className="mt-4 text-sm text-muted-foreground">
                This booking is already {order.status}.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

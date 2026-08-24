import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, MapPin } from "lucide-react";

import { MarketingShell } from "@/components/marketing/shell";
import { ErrorState, LoadingBlock } from "@/components/states";
import { StatusPill } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { rupees, showDay, showTime } from "@/lib/format";
import { bookingKeys, bookingStatusTone, getBooking } from "@/features/booking/api";

export const Route = createFileRoute("/bookings/$bookingId")({
  component: BookingConfirmationPage,
});

function BookingConfirmationPage() {
  const { bookingId } = Route.useParams();
  const booking = useQuery({
    queryKey: bookingKeys.booking(bookingId),
    queryFn: () => getBooking(bookingId),
  });

  if (booking.isPending) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-2xl px-6 py-16">
          <LoadingBlock label="Loading your ticket" />
        </div>
      </MarketingShell>
    );
  }

  if (booking.isError) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-2xl px-6 py-16">
          <ErrorState title="Booking not found" description={booking.error.message} />
        </div>
      </MarketingShell>
    );
  }

  const order = booking.data;
  const seats = order.booking_seats
    .map((row) => `${row.seats.row_label}${row.seats.seat_number}`)
    .sort();
  const payment = order.payments[0];

  return (
    <MarketingShell>
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-6">
          {order.status === "confirmed" ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4 text-brand">
              <CheckCircle2 className="size-5" aria-hidden />
              <p className="text-sm font-medium">Booking confirmed. Enjoy the film.</p>
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-xl border bg-card">
            <div className="flex items-start justify-between gap-4 border-b p-6">
              <div>
                <p className="label-mono">Ticket</p>
                <h1 className="mt-2 text-2xl font-medium tracking-tight">
                  {order.shows.movies.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {showDay(order.shows.starts_at)} at {showTime(order.shows.starts_at)}
                </p>
              </div>
              <StatusPill label={order.status} tone={bookingStatusTone(order.status)} />
            </div>

            <dl className="grid gap-4 p-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Booking code</dt>
                <dd className="mt-1 font-mono text-sm">{order.booking_code}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Seats</dt>
                <dd className="mt-1 text-sm">{seats.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Theatre</dt>
                <dd className="mt-1 inline-flex items-start gap-1 text-sm">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  {order.shows.screens.theatres.name} · {order.shows.screens.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Amount paid</dt>
                <dd className="mt-1 text-sm tabular-nums">{rupees(Number(order.total_amount))}</dd>
              </div>
              {payment ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Payment</dt>
                  <dd className="mt-1 text-sm">
                    {payment.method} · {payment.status} ·{" "}
                    <span className="font-mono text-xs">{payment.transaction_ref}</span>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="brand">
              <Link to="/bookings">My bookings</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/movies">Book another film</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

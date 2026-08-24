import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ticket } from "lucide-react";
import { toast } from "sonner";

import { MarketingShell, PageIntro } from "@/components/marketing/shell";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/states";
import { StatusPill } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { rupees, showDay, showTime } from "@/lib/format";
import { useAuth } from "@/features/auth/auth-context";
import {
  bookingKeys,
  bookingStatusTone,
  cancelBooking,
  listMyBookings,
} from "@/features/booking/api";

export const Route = createFileRoute("/bookings/")({
  head: () => ({
    meta: [{ title: "My bookings" }, { name: "robots", content: "noindex" }],
  }),
  component: MyBookingsPage,
});

function MyBookingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login", search: { redirect: "/bookings" } });
    }
  }, [loading, user, navigate]);

  const bookings = useQuery({
    queryKey: bookingKeys.myBookings,
    queryFn: listMyBookings,
    enabled: !!user,
  });

  const cancel = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success("Booking cancelled");
      void queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings });
    },
    onError: (error: Error) => toast.error("Couldn't cancel", { description: error.message }),
  });

  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Account"
        title="My bookings"
        description="Every ticket you've booked, with its payment status and seats."
      />

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          {loading || bookings.isPending ? <LoadingBlock label="Loading bookings" /> : null}

          {bookings.isError ? (
            <ErrorState
              title="Couldn't load bookings"
              description={bookings.error.message}
              onRetry={() => void bookings.refetch()}
            />
          ) : null}

          {bookings.isSuccess && bookings.data.length === 0 ? (
            <EmptyState
              icon={<Ticket className="size-4" aria-hidden />}
              title="No bookings yet"
              description="Once you book a show it will appear here with your seats and payment status."
              action={
                <Button asChild variant="brand">
                  <Link to="/movies">Browse films</Link>
                </Button>
              }
            />
          ) : null}

          <ul className="space-y-4">
            {(bookings.data ?? []).map((order) => {
              const seats = order.booking_seats
                .map((row) => `${row.seats.row_label}${row.seats.seat_number}`)
                .sort();
              return (
                <li key={order.id} className="rounded-xl border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-medium tracking-tight">
                        {order.shows.movies.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.shows.screens.theatres.name} · {showDay(order.shows.starts_at)} at{" "}
                        {showTime(order.shows.starts_at)}
                      </p>
                      <p className="mt-2 text-sm">
                        <span className="text-muted-foreground">Seats: </span>
                        {seats.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusPill label={order.status} tone={bookingStatusTone(order.status)} />
                      <p className="mt-2 text-sm tabular-nums">
                        {rupees(Number(order.total_amount))}
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {order.booking_code}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/bookings/$bookingId" params={{ bookingId: order.id }}>
                        View ticket
                      </Link>
                    </Button>
                    {order.status === "pending" ? (
                      <Button asChild variant="brand" size="sm">
                        <Link to="/checkout/$bookingId" params={{ bookingId: order.id }}>
                          Complete payment
                        </Link>
                      </Button>
                    ) : null}
                    {order.status === "pending" || order.status === "confirmed" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={cancel.isPending}
                        onClick={() => cancel.mutate(order.id)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </MarketingShell>
  );
}

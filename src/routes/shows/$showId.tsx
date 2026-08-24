import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";

import { MarketingShell } from "@/components/marketing/shell";
import { ErrorState, LoadingBlock } from "@/components/states";
import { StatusPill } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { rupees, showDay, showTime } from "@/lib/format";
import { useAuth } from "@/features/auth/auth-context";
import {
  bookingKeys,
  createBooking,
  getShow,
  getShowSeats,
  listCoupons,
} from "@/features/booking/api";
import type { ShowSeat } from "@/lib/database.types";

export const Route = createFileRoute("/shows/$showId")({
  component: SeatSelectionPage,
});

const MAX_SEATS = 10;

function SeatSelectionPage() {
  const { showId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selected, setSelected] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState("");

  const show = useQuery({ queryKey: bookingKeys.show(showId), queryFn: () => getShow(showId) });
  const seats = useQuery({
    queryKey: bookingKeys.seats(showId),
    queryFn: () => getShowSeats(showId),
  });
  const coupons = useQuery({ queryKey: bookingKeys.coupons, queryFn: listCoupons });

  const rows = useMemo(() => {
    const grouped = new Map<string, ShowSeat[]>();
    for (const seat of seats.data ?? []) {
      const bucket = grouped.get(seat.row_label) ?? [];
      bucket.push(seat);
      grouped.set(seat.row_label, bucket);
    }
    return [...grouped.entries()];
  }, [seats.data]);

  const selectedSeats = useMemo(
    () => (seats.data ?? []).filter((seat) => selected.includes(seat.seat_id)),
    [seats.data, selected],
  );
  const subtotal = selectedSeats.reduce((sum, seat) => sum + Number(seat.price), 0);

  const book = useMutation({
    mutationFn: () =>
      createBooking({ showId, seatIds: selected, couponCode: couponCode.trim() || null }),
    onSuccess: (bookingId) => {
      void navigate({ to: "/checkout/$bookingId", params: { bookingId } });
    },
    onError: (error: Error) => {
      toast.error("Couldn't hold those seats", { description: error.message });
      void seats.refetch();
      setSelected([]);
    },
  });

  const toggleSeat = (seat: ShowSeat) => {
    if (seat.is_booked) return;
    setSelected((current) => {
      if (current.includes(seat.seat_id)) return current.filter((id) => id !== seat.seat_id);
      if (current.length >= MAX_SEATS) {
        toast.warning(`You can select up to ${MAX_SEATS} seats.`);
        return current;
      }
      return [...current, seat.seat_id];
    });
  };

  const proceed = () => {
    if (selected.length === 0) {
      toast.warning("Select at least one seat.");
      return;
    }
    if (!user) {
      void navigate({ to: "/login", search: { redirect: `/shows/${showId}` } });
      return;
    }
    book.mutate();
  };

  if (show.isPending) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <LoadingBlock label="Loading show" />
        </div>
      </MarketingShell>
    );
  }

  if (show.isError) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <ErrorState title="Show not found" description={show.error.message} />
        </div>
      </MarketingShell>
    );
  }

  const venue = show.data.screens;

  return (
    <MarketingShell>
      <section className="border-b py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="label-mono">Select seats</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">{show.data.movies.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {venue.theatres.name} · {venue.name} · {showDay(show.data.starts_at)} at{" "}
            {showTime(show.data.starts_at)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill label={show.data.format} tone="info" />
            <StatusPill label={show.data.language} />
            <StatusPill label={`${show.data.movies.duration_minutes} min`} />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_320px]">
          <div>
            {seats.isPending ? <LoadingBlock label="Loading seat map" /> : null}
            {seats.isError ? (
              <ErrorState
                title="Couldn't load seats"
                description={seats.error.message}
                onRetry={() => void seats.refetch()}
              />
            ) : null}

            {rows.length > 0 ? (
              <div className="rounded-xl border bg-card p-6">
                <div className="mx-auto mb-8 max-w-md rounded-b-[50%] border-b-4 border-brand/40 pb-2 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Screen
                </div>

                <div className="space-y-2 overflow-x-auto">
                  {rows.map(([rowLabel, rowSeats]) => (
                    <div key={rowLabel} className="flex items-center gap-3">
                      <span className="w-5 shrink-0 font-mono text-xs text-muted-foreground">
                        {rowLabel}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rowSeats.map((seat) => {
                          const isSelected = selected.includes(seat.seat_id);
                          return (
                            <button
                              key={seat.seat_id}
                              type="button"
                              onClick={() => toggleSeat(seat)}
                              disabled={seat.is_booked}
                              aria-pressed={isSelected}
                              aria-label={`Seat ${rowLabel}${seat.seat_number}, ${seat.seat_type}, ${rupees(Number(seat.price))}${seat.is_booked ? ", unavailable" : ""}`}
                              title={`${rowLabel}${seat.seat_number} · ${seat.seat_type} · ${rupees(Number(seat.price))}`}
                              className={cn(
                                "size-7 rounded-md border text-[10px] font-medium transition-colors",
                                seat.is_booked &&
                                  "cursor-not-allowed bg-muted text-muted-foreground/40",
                                !seat.is_booked &&
                                  !isSelected &&
                                  "hover:border-brand hover:text-brand",
                                isSelected && "border-brand bg-brand text-brand-foreground",
                                !seat.is_booked &&
                                  seat.seat_type === "recliner" &&
                                  !isSelected &&
                                  "border-info/50",
                                !seat.is_booked &&
                                  seat.seat_type === "premium" &&
                                  !isSelected &&
                                  "border-warning/50",
                              )}
                            >
                              {seat.seat_number}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded border" /> Available
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded border border-brand bg-brand" /> Selected
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded border bg-muted" /> Booked
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded border border-warning/50" /> Premium
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded border border-info/50" /> Recliner
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="h-fit rounded-xl border bg-card p-6 lg:sticky lg:top-20">
            <h2 className="text-sm font-semibold">Your selection</h2>

            {selectedSeats.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Tap the seats you want. Booked seats are greyed out.
              </p>
            ) : (
              <ul className="mt-3 space-y-1.5 text-sm">
                {selectedSeats.map((seat) => (
                  <li key={seat.seat_id} className="flex justify-between">
                    <span>
                      {seat.row_label}
                      {seat.seat_number}{" "}
                      <span className="text-xs text-muted-foreground">({seat.seat_type})</span>
                    </span>
                    <span className="tabular-nums">{rupees(Number(seat.price))}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 space-y-2">
              <Label htmlFor="coupon">Coupon code</Label>
              <Input
                id="coupon"
                value={couponCode}
                placeholder="e.g. FIRST50"
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              {coupons.data && coupons.data.length > 0 ? (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {coupons.data.map((coupon) => (
                    <li key={coupon.id}>
                      <button
                        type="button"
                        className="underline underline-offset-2 hover:text-foreground"
                        onClick={() => setCouponCode(coupon.code)}
                      >
                        {coupon.code}
                      </button>{" "}
                      — {coupon.description}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-5 flex justify-between border-t pt-4 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{rupees(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Discounts and the 5% convenience fee are applied at checkout.
            </p>

            <Button
              variant="brand"
              className="mt-5 w-full"
              onClick={proceed}
              disabled={book.isPending || selected.length === 0}
            >
              {book.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Ticket className="size-4" aria-hidden />
              )}
              {user ? "Proceed to checkout" : "Sign in to continue"}
            </Button>
          </aside>
        </div>
      </section>
    </MarketingShell>
  );
}

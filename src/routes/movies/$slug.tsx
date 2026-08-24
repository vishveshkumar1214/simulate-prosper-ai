import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin, Star } from "lucide-react";

import { MarketingShell } from "@/components/marketing/shell";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/states";
import { StatusPill } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { rupees, showDay, showTime } from "@/lib/format";
import {
  bookingKeys,
  getMovieBySlug,
  listShowsForMovie,
  type ShowWithVenue,
} from "@/features/booking/api";

export const Route = createFileRoute("/movies/$slug")({
  component: MovieDetailPage,
});

const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

function MovieDetailPage() {
  const { slug } = Route.useParams();
  const movie = useQuery({
    queryKey: bookingKeys.movie(slug),
    queryFn: () => getMovieBySlug(slug),
  });
  const shows = useQuery({
    queryKey: bookingKeys.shows(movie.data?.id ?? ""),
    queryFn: () => listShowsForMovie(movie.data!.id),
    enabled: !!movie.data?.id,
  });

  const days = useMemo(() => {
    const unique = new Map<string, string>();
    for (const show of shows.data ?? []) unique.set(dayKey(show.starts_at), show.starts_at);
    return [...unique.entries()].map(([key, iso]) => ({ key, iso }));
  }, [shows.data]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const activeDay = selectedDay ?? days[0]?.key ?? null;

  const byTheatre = useMemo(() => {
    const grouped = new Map<
      string,
      { theatre: ShowWithVenue["screens"]["theatres"]; shows: ShowWithVenue[] }
    >();
    for (const show of shows.data ?? []) {
      if (activeDay && dayKey(show.starts_at) !== activeDay) continue;
      const theatre = show.screens.theatres;
      const bucket = grouped.get(theatre.id) ?? { theatre, shows: [] };
      bucket.shows.push(show);
      grouped.set(theatre.id, bucket);
    }
    return [...grouped.values()];
  }, [shows.data, activeDay]);

  if (movie.isPending) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <LoadingBlock label="Loading film" />
        </div>
      </MarketingShell>
    );
  }

  if (movie.isError) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <ErrorState title="Film not found" description={movie.error.message} />
        </div>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <section className="border-b py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[220px_1fr]">
          <div className="overflow-hidden rounded-xl border bg-muted">
            {movie.data.poster_url ? (
              <img
                src={movie.data.poster_url}
                alt={`${movie.data.title} poster`}
                className="aspect-[2/3] w-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <p className="label-mono">Now showing</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight">{movie.data.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusPill label={movie.data.certificate} />
              <StatusPill label={movie.data.language} tone="info" />
              {movie.data.genres.map((genre) => (
                <StatusPill key={genre} label={genre} tone="brand" />
              ))}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" aria-hidden />
                {movie.data.duration_minutes} min
              </span>
              {movie.data.rating !== null ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 fill-current" aria-hidden />
                  {movie.data.rating} / 10
                </span>
              ) : null}
            </div>
            <p className="mt-6 max-w-[70ch] text-pretty text-muted-foreground">
              {movie.data.synopsis}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-xl font-medium tracking-tight">Showtimes</h2>

          {shows.isPending ? <LoadingBlock className="mt-6" label="Loading showtimes" /> : null}
          {shows.isError ? (
            <ErrorState
              title="Couldn't load showtimes"
              description={shows.error.message}
              onRetry={() => void shows.refetch()}
            />
          ) : null}

          {shows.isSuccess && days.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<CalendarDays className="size-4" aria-hidden />}
              title="No upcoming shows"
              description="There are no future showtimes scheduled for this film yet."
            />
          ) : null}

          {days.length > 0 ? (
            <>
              <div className="mt-6 flex flex-wrap gap-2">
                {days.map((day) => (
                  <Button
                    key={day.key}
                    size="sm"
                    variant={day.key === activeDay ? "brand" : "outline"}
                    onClick={() => setSelectedDay(day.key)}
                  >
                    {showDay(day.iso)}
                  </Button>
                ))}
              </div>

              <ul className="mt-8 space-y-4">
                {byTheatre.map(({ theatre, shows: theatreShows }) => (
                  <li key={theatre.id} className="rounded-xl border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-medium tracking-tight">{theatre.name}</h3>
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" aria-hidden />
                        {theatre.address ?? theatre.city}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {theatreShows.map((show) => (
                        <Button key={show.id} asChild variant="outline" size="sm">
                          <Link to="/shows/$showId" params={{ showId: show.id }}>
                            <span className="font-medium">{showTime(show.starts_at)}</span>
                            <span className="text-muted-foreground">
                              {show.screens.name} · {show.format} · from {rupees(show.base_price)}
                            </span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </MarketingShell>
  );
}

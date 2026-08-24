import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clapperboard, Clock, Star } from "lucide-react";

import { MarketingShell, PageIntro } from "@/components/marketing/shell";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/states";
import { StatusPill } from "@/components/status-badge";
import { bookingKeys, listMovies } from "@/features/booking/api";

export const Route = createFileRoute("/movies/")({
  head: () => ({
    meta: [
      { title: "Now showing — Book tickets" },
      { name: "description", content: "Browse films currently showing and book your seats." },
    ],
  }),
  component: MoviesPage,
});

function MoviesPage() {
  const movies = useQuery({ queryKey: bookingKeys.movies, queryFn: listMovies });

  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Now showing"
        title="Pick a film, pick your seats."
        description="Live showtimes across every partner theatre, with instant seat selection and confirmation."
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {movies.isPending ? <LoadingBlock label="Loading films" /> : null}

          {movies.isError ? (
            <ErrorState
              title="Couldn't load films"
              description={movies.error.message}
              onRetry={() => void movies.refetch()}
            />
          ) : null}

          {movies.isSuccess && movies.data.length === 0 ? (
            <EmptyState
              icon={<Clapperboard className="size-4" aria-hidden />}
              title="No films are showing yet"
              description="Run supabase/seed.sql against your Supabase project to load the catalogue."
            />
          ) : null}

          {movies.isSuccess && movies.data.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {movies.data.map((movie) => (
                <li key={movie.id}>
                  <Link
                    to="/movies/$slug"
                    params={{ slug: movie.slug }}
                    className="group block overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
                      {movie.poster_url ? (
                        <img
                          src={movie.poster_url}
                          alt={`${movie.title} poster`}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base font-medium tracking-tight">{movie.title}</h2>
                        {movie.rating !== null ? (
                          <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                            <Star className="size-3.5 fill-current" aria-hidden />
                            {movie.rating}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {movie.genres.join(" · ")}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <StatusPill label={movie.certificate} />
                        <StatusPill label={movie.language} tone="info" />
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" aria-hidden />
                          {movie.duration_minutes} min
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </MarketingShell>
  );
}

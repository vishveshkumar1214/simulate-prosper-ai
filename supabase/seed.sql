-- ============================================================================
-- Demo catalogue data: movies, theatres, screens, seats, shows and coupons.
-- Run after schema.sql. Idempotent — safe to re-run (shows are regenerated for
-- the next 7 days).
-- ============================================================================

insert into public.movies
  (slug, title, synopsis, poster_url, backdrop_url, genres, language, certificate, duration_minutes, rating, release_date)
values
  ('orbital-drift', 'Orbital Drift',
   'A salvage crew stranded above a dying planet must choose between the cargo that can save a colony and the one crewmate who knows the way home.',
   'https://picsum.photos/seed/orbital-drift/400/600', 'https://picsum.photos/seed/orbital-drift-bd/1600/900',
   array['Sci-Fi', 'Thriller'], 'English', 'UA', 138, 8.4, '2026-07-10'),
  ('the-quiet-ledger', 'The Quiet Ledger',
   'A small-town accountant discovers a decade of forged entries and becomes the only witness willing to testify.',
   'https://picsum.photos/seed/quiet-ledger/400/600', 'https://picsum.photos/seed/quiet-ledger-bd/1600/900',
   array['Drama', 'Crime'], 'English', 'A', 124, 7.9, '2026-06-19'),
  ('monsoon-lines', 'Monsoon Lines',
   'Two rival railway engineers are forced to share a carriage across a flooded countryside.',
   'https://picsum.photos/seed/monsoon-lines/400/600', 'https://picsum.photos/seed/monsoon-lines-bd/1600/900',
   array['Romance', 'Drama'], 'Hindi', 'U', 146, 8.1, '2026-08-01'),
  ('paper-tigers', 'Paper Tigers',
   'A retired stunt team reunites for one last heist disguised as a film shoot.',
   'https://picsum.photos/seed/paper-tigers/400/600', 'https://picsum.photos/seed/paper-tigers-bd/1600/900',
   array['Action', 'Comedy'], 'English', 'UA', 112, 7.2, '2026-08-14'),
  ('the-long-shore', 'The Long Shore',
   'A marine biologist tracking a vanishing species uncovers what the harbour authority has been dumping at night.',
   'https://picsum.photos/seed/long-shore/400/600', 'https://picsum.photos/seed/long-shore-bd/1600/900',
   array['Mystery', 'Drama'], 'English', 'UA', 131, 7.6, '2026-05-30'),
  ('starlight-bakery', 'Starlight Bakery',
   'An animated tale of a night-shift baker whose pastries grant one honest wish each.',
   'https://picsum.photos/seed/starlight-bakery/400/600', 'https://picsum.photos/seed/starlight-bakery-bd/1600/900',
   array['Animation', 'Family'], 'English', 'U', 96, 8.8, '2026-08-08')
on conflict (slug) do update set
  title = excluded.title,
  synopsis = excluded.synopsis,
  poster_url = excluded.poster_url,
  backdrop_url = excluded.backdrop_url,
  genres = excluded.genres,
  duration_minutes = excluded.duration_minutes,
  rating = excluded.rating,
  release_date = excluded.release_date,
  is_active = true;

insert into public.theatres (name, city, address)
values
  ('Aurora Cineplex', 'Bengaluru', '14 Residency Road, Bengaluru 560025'),
  ('Meridian Screens', 'Bengaluru', 'Level 3, Orion Mall, Rajajinagar, Bengaluru 560055'),
  ('Riverside IMAX', 'Mumbai', 'Marine Lines, Mumbai 400020')
on conflict (name, city) do update set address = excluded.address, is_active = true;

insert into public.screens (theatre_id, name, screen_type)
select t.id, s.name, s.screen_type
from public.theatres t
cross join (values ('Screen 1', '2D'), ('Screen 2', '3D'), ('Screen 3', 'IMAX')) as s(name, screen_type)
on conflict (theatre_id, name) do update set screen_type = excluded.screen_type;

-- Seats: rows A-J, 14 per row. A-B recliner, C-E premium, rest regular.
insert into public.seats (screen_id, row_label, seat_number, seat_type, price_multiplier)
select
  sc.id,
  r.row_label,
  n.seat_number,
  case
    when r.row_label in ('A', 'B') then 'recliner'::public.seat_type
    when r.row_label in ('C', 'D', 'E') then 'premium'::public.seat_type
    else 'regular'::public.seat_type
  end,
  case
    when r.row_label in ('A', 'B') then 1.80
    when r.row_label in ('C', 'D', 'E') then 1.35
    else 1.00
  end
from public.screens sc
cross join (select unnest(array['A','B','C','D','E','F','G','H','I','J']) as row_label) r
cross join (select generate_series(1, 14) as seat_number) n
on conflict (screen_id, row_label, seat_number) do nothing;

-- Shows: every movie plays on a rotating screen for the next 7 days.
with numbered_screens as (
  select
    id,
    screen_type,
    row_number() over (order by theatre_id, name) as rn,
    count(*) over () as total
  from public.screens
),
numbered_movies as (
  select id, language, row_number() over (order by release_date desc, slug) as rn
  from public.movies
  where is_active
)
insert into public.shows (movie_id, screen_id, starts_at, base_price, language, format)
select
  m.id,
  sc.id,
  (current_date + d.day_offset)::timestamptz + slot.at,
  slot.price,
  m.language,
  sc.screen_type
from numbered_movies m
join numbered_screens sc on sc.rn = ((m.rn - 1) % sc.total) + 1
cross join (select generate_series(0, 6) as day_offset) d
cross join (values
  (interval '10 hours 30 minutes', 220.00),
  (interval '14 hours 0 minutes', 260.00),
  (interval '18 hours 15 minutes', 320.00),
  (interval '21 hours 45 minutes', 300.00)
) as slot(at, price)
on conflict (screen_id, starts_at) do nothing;

insert into public.coupons
  (code, description, discount_type, discount_value, min_amount, max_discount, valid_to, usage_limit)
values
  ('FIRST50', 'Flat ₹50 off your first booking', 'flat', 50, 200, null, now() + interval '180 days', null),
  ('WEEKEND15', '15% off, up to ₹150', 'percent', 15, 400, 150, now() + interval '180 days', null),
  ('SHOWTIME25', '25% off premium seats, up to ₹300', 'percent', 25, 800, 300, now() + interval '90 days', 500)
on conflict (code) do update set
  description = excluded.description,
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  min_amount = excluded.min_amount,
  max_discount = excluded.max_discount,
  valid_to = excluded.valid_to,
  is_active = true;

-- ============================================================================
-- Movie ticket booking schema
-- Run this file once against the existing Supabase project
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- It is idempotent: re-running it is safe.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.seat_type as enum ('regular', 'premium', 'recliner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.discount_type as enum ('percent', 'flat');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  synopsis text,
  poster_url text,
  backdrop_url text,
  genres text[] not null default '{}',
  language text not null default 'English',
  certificate text not null default 'UA',
  duration_minutes integer not null check (duration_minutes > 0),
  rating numeric(3, 1) check (rating >= 0 and rating <= 10),
  release_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.theatres (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, city)
);

create table if not exists public.screens (
  id uuid primary key default gen_random_uuid(),
  theatre_id uuid not null references public.theatres (id) on delete cascade,
  name text not null,
  screen_type text not null default '2D',
  created_at timestamptz not null default now(),
  unique (theatre_id, name)
);

create table if not exists public.seats (
  id uuid primary key default gen_random_uuid(),
  screen_id uuid not null references public.screens (id) on delete cascade,
  row_label text not null,
  seat_number integer not null check (seat_number > 0),
  seat_type public.seat_type not null default 'regular',
  price_multiplier numeric(4, 2) not null default 1.0 check (price_multiplier > 0),
  is_active boolean not null default true,
  unique (screen_id, row_label, seat_number)
);

create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies (id) on delete cascade,
  screen_id uuid not null references public.screens (id) on delete cascade,
  starts_at timestamptz not null,
  base_price numeric(10, 2) not null check (base_price >= 0),
  language text not null default 'English',
  format text not null default '2D',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (screen_id, starts_at)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type public.discount_type not null,
  discount_value numeric(10, 2) not null check (discount_value > 0),
  min_amount numeric(10, 2) not null default 0 check (min_amount >= 0),
  max_discount numeric(10, 2) check (max_discount is null or max_discount > 0),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  times_used integer not null default 0 check (times_used >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  show_id uuid not null references public.shows (id) on delete restrict,
  coupon_id uuid references public.coupons (id) on delete set null,
  status public.booking_status not null default 'pending',
  subtotal_amount numeric(10, 2) not null check (subtotal_amount >= 0),
  discount_amount numeric(10, 2) not null default 0 check (discount_amount >= 0),
  convenience_fee numeric(10, 2) not null default 0 check (convenience_fee >= 0),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_seats (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  show_id uuid not null references public.shows (id) on delete cascade,
  seat_id uuid not null references public.seats (id) on delete restrict,
  price numeric(10, 2) not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (booking_id, seat_id)
);

-- One active hold/booking per seat per show.
create unique index if not exists booking_seats_one_active_per_show_seat
  on public.booking_seats (show_id, seat_id)
  where is_active;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(10, 2) not null check (amount >= 0),
  method text not null,
  status public.payment_status not null default 'pending',
  transaction_ref text not null unique,
  is_simulated boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
create index if not exists movies_is_active_idx on public.movies (is_active);
create index if not exists screens_theatre_id_idx on public.screens (theatre_id);
create index if not exists seats_screen_id_idx on public.seats (screen_id);
create index if not exists shows_movie_starts_at_idx on public.shows (movie_id, starts_at);
create index if not exists shows_screen_id_idx on public.shows (screen_id);
create index if not exists bookings_user_created_idx on public.bookings (user_id, created_at desc);
create index if not exists bookings_show_id_idx on public.bookings (show_id);
create index if not exists booking_seats_booking_id_idx on public.booking_seats (booking_id);
create index if not exists payments_user_id_idx on public.payments (user_id);

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Create a profile row whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Releasing seats when a booking stops being active.
create or replace function public.sync_booking_seat_state()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('cancelled', 'expired') then
    update public.booking_seats set is_active = false where booking_id = new.id and is_active;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_sync_seat_state on public.bookings;
create trigger bookings_sync_seat_state
  after update of status on public.bookings
  for each row execute function public.sync_booking_seat_state();

-- ----------------------------------------------------------------------------
-- Grants (RLS below is what actually restricts the rows)
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on
  public.movies, public.theatres, public.screens, public.seats, public.shows, public.coupons
  to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.bookings to authenticated;
grant select, insert on public.booking_seats to authenticated;
grant select, insert on public.payments to authenticated;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.movies enable row level security;
alter table public.theatres enable row level security;
alter table public.screens enable row level security;
alter table public.seats enable row level security;
alter table public.shows enable row level security;
alter table public.coupons enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_seats enable row level security;
alter table public.payments enable row level security;

-- Catalogue: readable by everyone, writable only via the service role.
drop policy if exists "movies are public" on public.movies;
create policy "movies are public" on public.movies for select using (true);

drop policy if exists "theatres are public" on public.theatres;
create policy "theatres are public" on public.theatres for select using (true);

drop policy if exists "screens are public" on public.screens;
create policy "screens are public" on public.screens for select using (true);

drop policy if exists "seats are public" on public.seats;
create policy "seats are public" on public.seats for select using (true);

drop policy if exists "shows are public" on public.shows;
create policy "shows are public" on public.shows for select using (true);

drop policy if exists "active coupons are public" on public.coupons;
create policy "active coupons are public" on public.coupons
  for select using (is_active and (valid_to is null or valid_to > now()));

-- Profiles: each user owns their row.
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Bookings: each user sees and manages only their own.
drop policy if exists "bookings select own" on public.bookings;
create policy "bookings select own" on public.bookings
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "bookings insert own" on public.bookings;
create policy "bookings insert own" on public.bookings
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "bookings update own" on public.bookings;
create policy "bookings update own" on public.bookings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "booking seats select own" on public.booking_seats;
create policy "booking seats select own" on public.booking_seats
  for select to authenticated using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_seats.booking_id and b.user_id = auth.uid()
    )
  );

drop policy if exists "booking seats insert own" on public.booking_seats;
create policy "booking seats insert own" on public.booking_seats
  for insert to authenticated with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_seats.booking_id and b.user_id = auth.uid()
    )
  );

drop policy if exists "payments select own" on public.payments;
create policy "payments select own" on public.payments
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "payments insert own" on public.payments;
create policy "payments insert own" on public.payments
  for insert to authenticated with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RPCs
-- ----------------------------------------------------------------------------

-- Seat map for a show. Security definer so occupancy of *other* users' bookings
-- is visible without exposing the bookings themselves.
create or replace function public.get_show_seats(p_show_id uuid)
returns table (
  seat_id uuid,
  row_label text,
  seat_number integer,
  seat_type public.seat_type,
  price numeric,
  is_booked boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.row_label,
    s.seat_number,
    s.seat_type,
    round(sh.base_price * s.price_multiplier, 2),
    exists (
      select 1 from public.booking_seats bs
      where bs.show_id = p_show_id and bs.seat_id = s.id and bs.is_active
    )
  from public.shows sh
  join public.seats s on s.screen_id = sh.screen_id
  where sh.id = p_show_id and s.is_active
  order by s.row_label, s.seat_number;
$$;

-- Creates a pending booking and holds the selected seats atomically.
create or replace function public.create_booking(
  p_show_id uuid,
  p_seat_ids uuid[],
  p_coupon_code text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_show public.shows;
  v_coupon public.coupons;
  v_subtotal numeric(10, 2) := 0;
  v_discount numeric(10, 2) := 0;
  v_fee numeric(10, 2);
  v_booking_id uuid;
  v_seat record;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to book seats.' using errcode = '42501';
  end if;

  if p_seat_ids is null or array_length(p_seat_ids, 1) is null then
    raise exception 'Select at least one seat.' using errcode = '22023';
  end if;

  if array_length(p_seat_ids, 1) > 10 then
    raise exception 'You can book at most 10 seats per transaction.' using errcode = '22023';
  end if;

  select * into v_show from public.shows where id = p_show_id and is_active;
  if not found then
    raise exception 'Show not found.' using errcode = 'P0002';
  end if;

  if v_show.starts_at <= now() then
    raise exception 'This show has already started.' using errcode = '22023';
  end if;

  -- Lock the seat rows so concurrent bookings serialise on the same seats.
  perform 1 from public.seats
    where id = any (p_seat_ids) and screen_id = v_show.screen_id and is_active
    for update;

  if (
    select count(*) from public.seats
    where id = any (p_seat_ids) and screen_id = v_show.screen_id and is_active
  ) <> array_length(p_seat_ids, 1) then
    raise exception 'One or more seats do not belong to this screen.' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.booking_seats
    where show_id = p_show_id and seat_id = any (p_seat_ids) and is_active
  ) then
    raise exception 'One or more of the selected seats have just been taken.' using errcode = '23505';
  end if;

  select coalesce(sum(round(v_show.base_price * s.price_multiplier, 2)), 0)
    into v_subtotal
    from public.seats s
   where s.id = any (p_seat_ids);

  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 then
    select * into v_coupon
      from public.coupons
     where upper(code) = upper(trim(p_coupon_code))
       and is_active
       and valid_from <= now()
       and (valid_to is null or valid_to > now())
       and (usage_limit is null or times_used < usage_limit)
     for update;

    if not found then
      raise exception 'Coupon is not valid.' using errcode = '22023';
    end if;

    if v_subtotal < v_coupon.min_amount then
      raise exception 'Coupon requires a minimum order of %.', v_coupon.min_amount using errcode = '22023';
    end if;

    v_discount := case
      when v_coupon.discount_type = 'percent' then round(v_subtotal * v_coupon.discount_value / 100, 2)
      else v_coupon.discount_value
    end;

    if v_coupon.max_discount is not null then
      v_discount := least(v_discount, v_coupon.max_discount);
    end if;
    v_discount := least(v_discount, v_subtotal);
  end if;

  v_fee := round((v_subtotal - v_discount) * 0.05, 2);

  insert into public.bookings (
    booking_code, user_id, show_id, coupon_id, status,
    subtotal_amount, discount_amount, convenience_fee, total_amount
  )
  values (
    'BK' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
    v_user_id,
    p_show_id,
    v_coupon.id,
    'pending',
    v_subtotal,
    v_discount,
    v_fee,
    v_subtotal - v_discount + v_fee
  )
  returning id into v_booking_id;

  for v_seat in
    select s.id, round(v_show.base_price * s.price_multiplier, 2) as price
      from public.seats s
     where s.id = any (p_seat_ids)
  loop
    insert into public.booking_seats (booking_id, show_id, seat_id, price)
    values (v_booking_id, p_show_id, v_seat.id, v_seat.price);
  end loop;

  return v_booking_id;
end;
$$;

-- Simulated payment: no external gateway, the outcome is decided here.
create or replace function public.pay_booking(
  p_booking_id uuid,
  p_method text,
  p_succeed boolean default true
)
returns public.payment_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_booking public.bookings;
  v_status public.payment_status;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to pay.' using errcode = '42501';
  end if;

  select * into v_booking
    from public.bookings
   where id = p_booking_id and user_id = v_user_id
   for update;

  if not found then
    raise exception 'Booking not found.' using errcode = 'P0002';
  end if;

  if v_booking.status <> 'pending' then
    raise exception 'This booking is already %.', v_booking.status using errcode = '22023';
  end if;

  v_status := case when p_succeed then 'succeeded' else 'failed' end;

  insert into public.payments (booking_id, user_id, amount, method, status, transaction_ref)
  values (
    p_booking_id,
    v_user_id,
    v_booking.total_amount,
    p_method,
    v_status,
    'SIM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))
  )
  on conflict (booking_id) do update
    set status = excluded.status,
        method = excluded.method,
        amount = excluded.amount,
        transaction_ref = excluded.transaction_ref;

  if p_succeed then
    update public.bookings set status = 'confirmed' where id = p_booking_id;
    if v_booking.coupon_id is not null then
      update public.coupons set times_used = times_used + 1 where id = v_booking.coupon_id;
    end if;
  else
    update public.bookings set status = 'cancelled' where id = p_booking_id;
  end if;

  return v_status;
end;
$$;

-- Cancels a pending or confirmed booking and releases its seats.
create or replace function public.cancel_booking(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;

  update public.bookings
     set status = 'cancelled'
   where id = p_booking_id
     and user_id = v_user_id
     and status in ('pending', 'confirmed');

  if not found then
    raise exception 'Booking cannot be cancelled.' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.get_show_seats(uuid) from public;
revoke all on function public.create_booking(uuid, uuid[], text) from public;
revoke all on function public.pay_booking(uuid, text, boolean) from public;
revoke all on function public.cancel_booking(uuid) from public;

grant execute on function public.get_show_seats(uuid) to anon, authenticated;
grant execute on function public.create_booking(uuid, uuid[], text) to authenticated;
grant execute on function public.pay_booking(uuid, text, boolean) to authenticated;
grant execute on function public.cancel_booking(uuid) to authenticated;

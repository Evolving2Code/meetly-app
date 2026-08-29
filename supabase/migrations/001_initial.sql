-- Meetly initial schema

create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  name text,
  avatar_url text,
  timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  duration int not null,
  buffer_before int not null default 0,
  buffer_after int not null default 0,
  min_notice int not null default 60,
  max_days_ahead int not null default 60,
  location text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time text not null,
  end_time text not null
);

create index availability_slots_user_day_idx on public.availability_slots (user_id, day_of_week);

create table public.date_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  available boolean not null default false,
  start_time text,
  end_time text,
  unique (user_id, date)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references public.event_types (id) on delete cascade,
  host_id uuid not null references public.profiles (id) on delete cascade,
  guest_name text not null,
  guest_email text not null,
  guest_notes text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  timezone text not null,
  status text not null default 'confirmed',
  google_event_id text,
  cancel_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_host_start_idx on public.bookings (host_id, start_time);
create index bookings_event_start_idx on public.bookings (event_type_id, start_time);

create table public.google_tokens (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  access_token text,
  refresh_token text,
  expires_at bigint,
  scope text,
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger event_types_updated_at
  before update on public.event_types
  for each row execute function public.set_updated_at();

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.event_types enable row level security;
alter table public.availability_slots enable row level security;
alter table public.date_overrides enable row level security;
alter table public.bookings enable row level security;
alter table public.google_tokens enable row level security;

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Public can view profiles with username"
  on public.profiles for select
  using (username is not null);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Event types
create policy "Users manage own event types"
  on public.event_types for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public can view active event types"
  on public.event_types for select
  using (active = true);

-- Availability
create policy "Users manage own availability"
  on public.availability_slots for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public can view availability"
  on public.availability_slots for select
  using (true);

-- Date overrides
create policy "Users manage own overrides"
  on public.date_overrides for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public can view overrides"
  on public.date_overrides for select
  using (true);

-- Bookings
create policy "Hosts can view own bookings"
  on public.bookings for select
  using (auth.uid() = host_id);

-- Google tokens (host only)
create policy "Users manage own google tokens"
  on public.google_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

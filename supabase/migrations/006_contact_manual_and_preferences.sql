-- Manual contact fields and contacts preferences

alter table public.contact_notes
  add column if not exists name text,
  add column if not exists created_at timestamptz not null default now();

create table public.contact_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  default_sort text not null default 'recent' check (default_sort in ('recent', 'name', 'meetings')),
  auto_import_from_bookings boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.contact_preferences enable row level security;

create policy "Users manage own contact preferences"
  on public.contact_preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger contact_preferences_updated_at
  before update on public.contact_preferences
  for each row execute function public.set_updated_at();

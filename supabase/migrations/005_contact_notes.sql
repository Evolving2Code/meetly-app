-- Per-guest notes for hosts (keyed by guest email)

create table public.contact_notes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  guest_email text not null,
  notes text,
  updated_at timestamptz not null default now(),
  primary key (user_id, guest_email)
);

alter table public.contact_notes enable row level security;

create policy "Users manage own contact notes"
  on public.contact_notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger contact_notes_updated_at
  before update on public.contact_notes
  for each row execute function public.set_updated_at();

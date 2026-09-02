-- Host notification preferences and booking reminder tracking

create table public.notification_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  email_on_new_booking boolean not null default true,
  email_guest_confirmation boolean not null default true,
  email_booking_reminder boolean not null default true,
  reminder_hours_before int not null default 24 check (reminder_hours_before between 1 and 168),
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "Users manage own notification preferences"
  on public.notification_preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger notification_preferences_updated_at
  before update on public.notification_preferences
  for each row execute function public.set_updated_at();

alter table public.bookings
  add column if not exists host_reminder_sent_at timestamptz,
  add column if not exists guest_reminder_sent_at timestamptz;

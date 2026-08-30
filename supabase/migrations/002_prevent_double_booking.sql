-- Prevent two confirmed bookings for the same host at the same start time.
create unique index if not exists bookings_host_start_confirmed_unique
  on public.bookings (host_id, start_time)
  where status = 'confirmed';

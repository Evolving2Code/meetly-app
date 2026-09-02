export type Profile = {
  id: string;
  username: string | null;
  name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type EventType = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  buffer_before: number;
  buffer_after: number;
  min_notice: number;
  max_days_ahead: number;
  location: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type AvailabilitySlot = {
  id: string;
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export type DateOverride = {
  id: string;
  user_id: string;
  date: string;
  available: boolean;
  start_time: string | null;
  end_time: string | null;
};

export type Booking = {
  id: string;
  event_type_id: string;
  host_id: string;
  guest_name: string;
  guest_email: string;
  guest_notes: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  google_event_id: string | null;
  cancel_token: string;
  host_reminder_sent_at: string | null;
  guest_reminder_sent_at: string | null;
  created_at: string;
  updated_at: string;
  event_types?: EventType;
};

export type NotificationPreferences = {
  user_id: string;
  email_on_new_booking: boolean;
  email_guest_confirmation: boolean;
  email_booking_reminder: boolean;
  reminder_hours_before: number;
  updated_at: string;
};

export type GoogleTokens = {
  user_id: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  scope: string | null;
  updated_at: string;
};

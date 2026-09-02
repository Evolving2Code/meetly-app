import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultNotificationPreferences } from "@/lib/email/booking-emails";
import type { NotificationPreferences } from "@/lib/supabase/types";

export async function getNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<NotificationPreferences> {
  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data ?? defaultNotificationPreferences(userId);
}

export function normalizeNotificationPreferencesInput(body: Record<string, unknown>) {
  const updates: Partial<
    Pick<
      NotificationPreferences,
      | "email_on_new_booking"
      | "email_guest_confirmation"
      | "email_booking_reminder"
      | "reminder_hours_before"
    >
  > = {};

  if (body.emailOnNewBooking !== undefined) {
    updates.email_on_new_booking = Boolean(body.emailOnNewBooking);
  }

  if (body.emailGuestConfirmation !== undefined) {
    updates.email_guest_confirmation = Boolean(body.emailGuestConfirmation);
  }

  if (body.emailBookingReminder !== undefined) {
    updates.email_booking_reminder = Boolean(body.emailBookingReminder);
  }

  if (body.reminderHoursBefore !== undefined) {
    const hours = Number(body.reminderHoursBefore);
    if (!Number.isInteger(hours) || hours < 1 || hours > 168) {
      return { error: "Reminder lead time must be between 1 and 168 hours." };
    }

    updates.reminder_hours_before = hours;
  }

  if (Object.keys(updates).length === 0) {
    return { error: "No valid fields to update." };
  }

  return { updates };
}

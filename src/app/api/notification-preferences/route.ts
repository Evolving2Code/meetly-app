import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import {
  getNotificationPreferences,
  normalizeNotificationPreferencesInput,
} from "@/lib/notifications/preferences";

export async function GET() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const preferences = await getNotificationPreferences(supabase, user!.id);

  return NextResponse.json({
    emailOnNewBooking: preferences.email_on_new_booking,
    emailGuestConfirmation: preferences.email_guest_confirmation,
    emailBookingReminder: preferences.email_booking_reminder,
    reminderHoursBefore: preferences.reminder_hours_before,
  });
}

export async function PATCH(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const normalized = normalizeNotificationPreferencesInput(body);

  if ("error" in normalized) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const { data: preferences, error } = await supabase
    .from("notification_preferences")
    .upsert(
      {
        user_id: user!.id,
        ...normalized.updates,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    emailOnNewBooking: preferences.email_on_new_booking,
    emailGuestConfirmation: preferences.email_guest_confirmation,
    emailBookingReminder: preferences.email_booking_reminder,
    reminderHoursBefore: preferences.reminder_hours_before,
  });
}

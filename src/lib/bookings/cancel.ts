import { isBefore } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildBookingEmailContext } from "@/lib/bookings/email-context";
import {
  sendGuestCancellationEmail,
  sendHostCancellationEmail,
} from "@/lib/email/booking-emails";
import { deleteGoogleCalendarEvent } from "@/lib/google-calendar";
import { getNotificationPreferences } from "@/lib/notifications/preferences";
import type { Booking, EventType } from "@/lib/supabase/types";

export async function cancelBookingById(bookingId: string) {
  const admin = createAdminClient();

  const { data: booking, error } = await admin
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return { success: false as const, error: "Booking not found", status: 404 };
  }

  return cancelBookingRecord(booking as Booking);
}

export async function cancelBookingByToken(token: string) {
  const admin = createAdminClient();

  const { data: booking, error } = await admin
    .from("bookings")
    .select("*")
    .eq("cancel_token", token)
    .single();

  if (error || !booking) {
    return { success: false as const, error: "Booking not found", status: 404 };
  }

  return cancelBookingRecord(booking as Booking);
}

async function cancelBookingRecord(booking: Booking) {
  if (booking.status === "cancelled") {
    return { success: true as const };
  }

  if (isBefore(new Date(booking.start_time), new Date())) {
    return {
      success: false as const,
      error: "Past bookings cannot be cancelled",
      status: 400,
    };
  }

  if (booking.google_event_id) {
    await deleteGoogleCalendarEvent(booking.host_id, booking.google_event_id);
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", booking.id);

  if (error) {
    return { success: false as const, error: error.message, status: 500 };
  }

  const { data: fullBooking } = await admin
    .from("bookings")
    .select("*, event_types(*)")
    .eq("id", booking.id)
    .single();

  if (fullBooking) {
    const emailContext = await buildBookingEmailContext(
      fullBooking as Booking & { event_types: EventType | null },
    );
    if (emailContext) {
      const preferences = await getNotificationPreferences(admin, booking.host_id);
      if (preferences.email_on_new_booking) {
        await sendHostCancellationEmail(emailContext);
      }
      if (preferences.email_guest_confirmation) {
        await sendGuestCancellationEmail(emailContext);
      }
    }
  }

  return { success: true as const };
}

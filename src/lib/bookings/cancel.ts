import { isBefore } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteGoogleCalendarEvent } from "@/lib/google-calendar";
import type { Booking } from "@/lib/supabase/types";

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

  return { success: true as const };
}

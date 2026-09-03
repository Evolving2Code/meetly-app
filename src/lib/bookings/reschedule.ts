import { addMinutes } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  updateGoogleCalendarEvent,
} from "@/lib/google-calendar";
import { isSlotAvailable } from "@/lib/scheduling/slots";
import type { Booking, EventType } from "@/lib/supabase/types";

export async function rescheduleBookingByToken(token: string, startTime: Date, timezone: string) {
  const admin = createAdminClient();

  const { data: booking, error } = await admin
    .from("bookings")
    .select("*, event_types(*)")
    .eq("cancel_token", token)
    .single();

  if (error || !booking) {
    return { success: false as const, error: "Booking not found", status: 404 };
  }

  return rescheduleBookingRecord(booking as Booking & { event_types: EventType }, startTime, timezone);
}

async function rescheduleBookingRecord(
  booking: Booking & { event_types: EventType },
  startTime: Date,
  timezone: string,
) {
  if (booking.status === "cancelled") {
    return { success: false as const, error: "This booking has been cancelled", status: 400 };
  }

  if (new Date(booking.start_time) <= new Date()) {
    return { success: false as const, error: "Past bookings cannot be rescheduled", status: 400 };
  }

  if (Number.isNaN(startTime.getTime())) {
    return { success: false as const, error: "Invalid start time", status: 400 };
  }

  const admin = createAdminClient();
  const { data: host } = await admin.from("profiles").select("*").eq("id", booking.host_id).single();

  if (!host) {
    return { success: false as const, error: "Host not found", status: 404 };
  }

  const eventType = booking.event_types;
  const endTime = addMinutes(startTime, eventType.duration);

  const slotIsAvailable = await isSlotAvailable({
    hostId: booking.host_id,
    hostTimezone: host.timezone,
    eventType,
    startTime,
    excludeBookingId: booking.id,
  });

  if (!slotIsAvailable) {
    return { success: false as const, error: "Selected time is no longer available", status: 409 };
  }

  let googleEventId = booking.google_event_id;

  if (googleEventId) {
    const updated = await updateGoogleCalendarEvent({
      userId: booking.host_id,
      googleEventId,
      summary: `${eventType.title} with ${booking.guest_name}`,
      description: [
        `Guest: ${booking.guest_name}`,
        `Email: ${booking.guest_email}`,
        booking.guest_notes ? `Notes: ${booking.guest_notes}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      startTime,
      endTime,
      timezone,
      guestEmail: booking.guest_email,
      guestName: booking.guest_name,
      location: eventType.location,
    });

    if (!updated) {
      googleEventId = await createGoogleCalendarEvent({
        userId: booking.host_id,
        summary: `${eventType.title} with ${booking.guest_name}`,
        description: [
          `Guest: ${booking.guest_name}`,
          `Email: ${booking.guest_email}`,
          booking.guest_notes ? `Notes: ${booking.guest_notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        startTime,
        endTime,
        timezone,
        guestEmail: booking.guest_email,
        guestName: booking.guest_name,
        location: eventType.location,
      });
    }
  } else {
    googleEventId = await createGoogleCalendarEvent({
      userId: booking.host_id,
      summary: `${eventType.title} with ${booking.guest_name}`,
      description: [
        `Guest: ${booking.guest_name}`,
        `Email: ${booking.guest_email}`,
        booking.guest_notes ? `Notes: ${booking.guest_notes}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      startTime,
      endTime,
      timezone,
      guestEmail: booking.guest_email,
      guestName: booking.guest_name,
      location: eventType.location,
    });
  }

  const { data: updatedBooking, error: updateError } = await admin
    .from("bookings")
    .update({
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      timezone,
      google_event_id: googleEventId,
    })
    .eq("id", booking.id)
    .select("*, event_types(*)")
    .single();

  if (updateError) {
    if (updateError.code === "23505") {
      return { success: false as const, error: "Selected time is no longer available", status: 409 };
    }

    return { success: false as const, error: updateError.message, status: 500 };
  }

  return { success: true as const, booking: updatedBooking };
}

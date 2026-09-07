import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildCancelUrl,
  buildRescheduleUrl,
  type BookingEmailContext,
} from "@/lib/email/booking-emails";
import type { Booking, EventType } from "@/lib/supabase/types";

export async function buildBookingEmailContext(
  booking: Booking & { event_types: EventType | null },
): Promise<BookingEmailContext | null> {
  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [{ data: host }, { data: hostAuth }] = await Promise.all([
    admin.from("profiles").select("name, username").eq("id", booking.host_id).single(),
    admin.auth.admin.getUserById(booking.host_id),
  ]);

  const hostEmail = hostAuth.user?.email;
  if (!hostEmail) {
    return null;
  }

  return {
    hostName: host?.name ?? host?.username ?? "Host",
    hostEmail,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    eventTitle: booking.event_types?.title ?? "Meeting",
    startTime: new Date(booking.start_time),
    endTime: new Date(booking.end_time),
    timezone: booking.timezone,
    guestNotes: booking.guest_notes,
    cancelUrl: buildCancelUrl(siteUrl, booking.cancel_token),
    rescheduleUrl: buildRescheduleUrl(siteUrl, booking.cancel_token),
  };
}

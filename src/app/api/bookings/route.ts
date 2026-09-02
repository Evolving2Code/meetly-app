import { NextRequest, NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/api-utils";
import { cancelBookingByToken } from "@/lib/bookings/cancel";
import { formatGuestBookingResponse } from "@/lib/bookings/format";
import {
  buildCancelUrl,
  sendGuestConfirmationEmail,
  sendHostNewBookingEmail,
} from "@/lib/email/booking-emails";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";
import { getNotificationPreferences } from "@/lib/notifications/preferences";
import { isSlotAvailable } from "@/lib/scheduling/slots";

const bookingSchema = z.object({
  username: z.string(),
  slug: z.string(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestNotes: z.string().optional(),
  startTime: z.string(),
  timezone: z.string(),
});

export async function GET(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const status = request.nextUrl.searchParams.get("status") ?? "upcoming";
  const now = new Date().toISOString();

  let query = supabase
    .from("bookings")
    .select("*, event_types(*)")
    .eq("host_id", user!.id)
    .eq("status", "confirmed")
    .order("start_time", { ascending: status === "upcoming" })
    .limit(50);

  query =
    status === "upcoming"
      ? query.gte("start_time", now)
      : query.lt("start_time", now);

  const { data: bookings, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }

  const data = parsed.data;
  const startTime = new Date(data.startTime);

  if (Number.isNaN(startTime.getTime())) {
    return NextResponse.json({ error: "Invalid start time" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: host } = await admin
    .from("profiles")
    .select("*")
    .eq("username", data.username)
    .single();

  if (!host) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { data: eventType } = await admin
    .from("event_types")
    .select("*")
    .eq("user_id", host.id)
    .eq("slug", data.slug)
    .eq("active", true)
    .single();

  if (!eventType) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const endTime = addMinutes(startTime, eventType.duration);

  const slotIsAvailable = await isSlotAvailable({
    hostId: host.id,
    hostTimezone: host.timezone,
    eventType,
    startTime,
  });

  if (!slotIsAvailable) {
    return NextResponse.json({ error: "Selected time is no longer available" }, { status: 409 });
  }

  const googleEventId = await createGoogleCalendarEvent({
    userId: host.id,
    summary: `${eventType.title} with ${data.guestName}`,
    description: [
      `Guest: ${data.guestName}`,
      `Email: ${data.guestEmail}`,
      data.guestNotes ? `Notes: ${data.guestNotes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    startTime,
    endTime,
    timezone: data.timezone,
    guestEmail: data.guestEmail,
    guestName: data.guestName,
    location: eventType.location,
  });

  const { data: booking, error } = await admin
    .from("bookings")
    .insert({
      event_type_id: eventType.id,
      host_id: host.id,
      guest_name: data.guestName,
      guest_email: data.guestEmail,
      guest_notes: data.guestNotes ?? null,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      timezone: data.timezone,
      google_event_id: googleEventId,
    })
    .select("*, event_types(*)")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Selected time is no longer available" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const preferences = await getNotificationPreferences(admin, host.id);
  const { data: hostAuth } = await admin.auth.admin.getUserById(host.id);
  const hostEmail = hostAuth.user?.email ?? null;
  const cancelUrl = buildCancelUrl(siteUrl, booking.cancel_token);
  const emailContext = {
    hostName: host.name ?? host.username ?? "Host",
    hostEmail: hostEmail ?? "",
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    eventTitle: eventType.title,
    startTime,
    endTime,
    timezone: data.timezone,
    guestNotes: data.guestNotes,
    cancelUrl,
  };

  if (hostEmail && preferences.email_on_new_booking) {
    await sendHostNewBookingEmail(emailContext);
  }

  if (preferences.email_guest_confirmation) {
    await sendGuestConfirmationEmail(emailContext);
  }

  return NextResponse.json(formatGuestBookingResponse(booking), { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing cancel token" }, { status: 400 });
  }

  const result = await cancelBookingByToken(token);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}

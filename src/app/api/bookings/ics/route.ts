import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildIcsCalendarEvent } from "@/lib/bookings/ics";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing booking token" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: booking } = await admin
    .from("bookings")
    .select("*, event_types(title, location)")
    .eq("cancel_token", token)
    .single();

  if (!booking || booking.status === "cancelled") {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const [{ data: host }, { data: hostAuth }] = await Promise.all([
    admin.from("profiles").select("name, username").eq("id", booking.host_id).single(),
    admin.auth.admin.getUserById(booking.host_id),
  ]);

  const eventType = booking.event_types as { title: string; location: string | null } | null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const hostName = host?.name ?? host?.username ?? "Host";
  const hostEmail = hostAuth.user?.email ?? "host@meetly.app";

  const ics = buildIcsCalendarEvent({
    uid: `${booking.id}@meetly`,
    title: `${eventType?.title ?? "Meeting"} with ${hostName}`,
    description: `Booked via Meetly with ${hostName}.`,
    location: eventType?.location,
    startTime: new Date(booking.start_time),
    endTime: new Date(booking.end_time),
    timezone: booking.timezone,
    organizerEmail: hostEmail,
    organizerName: hostName,
    attendeeEmail: booking.guest_email,
    attendeeName: booking.guest_name,
    url: `${siteUrl}/cancel/${booking.cancel_token}`,
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="meetly-booking.ics"`,
    },
  });
}

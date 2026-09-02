import { addHours, subHours } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildCancelUrl,
  sendBookingReminderEmail,
} from "@/lib/email/booking-emails";
import { getNotificationPreferences } from "@/lib/notifications/preferences";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  const { data: bookings, error } = await admin
    .from("bookings")
    .select("*, event_types(title)")
    .eq("status", "confirmed")
    .gte("start_time", now.toISOString())
    .lte("start_time", addHours(now, 168).toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let remindersSent = 0;

  for (const booking of bookings ?? []) {
    const preferences = await getNotificationPreferences(admin, booking.host_id);

    if (!preferences.email_booking_reminder) {
      continue;
    }

    const reminderTarget = subHours(new Date(booking.start_time), preferences.reminder_hours_before);
    const windowStart = subHours(now, 1);

    if (reminderTarget > now || reminderTarget <= windowStart) {
      continue;
    }

    const { data: hostProfile } = await admin
      .from("profiles")
      .select("name, username")
      .eq("id", booking.host_id)
      .single();

    const { data: hostAuth } = await admin.auth.admin.getUserById(booking.host_id);
    const hostEmail = hostAuth.user?.email;
    const hostName = hostProfile?.name ?? hostProfile?.username ?? "Host";
    const eventTitle = (booking.event_types as { title: string } | null)?.title ?? "Meeting";
    const cancelUrl = buildCancelUrl(siteUrl, booking.cancel_token);

    if (!booking.host_reminder_sent_at && hostEmail) {
      const result = await sendBookingReminderEmail({
        recipientName: hostName,
        recipientEmail: hostEmail,
        counterpartName: booking.guest_name,
        eventTitle,
        startTime: new Date(booking.start_time),
        timezone: booking.timezone,
        audience: "host",
      });

      if (result.sent) {
        await admin
          .from("bookings")
          .update({ host_reminder_sent_at: now.toISOString() })
          .eq("id", booking.id);
        remindersSent += 1;
      }
    }

    if (!booking.guest_reminder_sent_at) {
      const result = await sendBookingReminderEmail({
        recipientName: booking.guest_name,
        recipientEmail: booking.guest_email,
        counterpartName: hostName,
        eventTitle,
        startTime: new Date(booking.start_time),
        timezone: booking.timezone,
        cancelUrl,
        audience: "guest",
      });

      if (result.sent) {
        await admin
          .from("bookings")
          .update({ guest_reminder_sent_at: now.toISOString() })
          .eq("id", booking.id);
        remindersSent += 1;
      }
    }
  }

  return NextResponse.json({ success: true, remindersSent });
}

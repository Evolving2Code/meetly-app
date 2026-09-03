import { NextRequest, NextResponse } from "next/server";
import { addDays } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { groupSlotsByDate } from "@/lib/scheduling/format";
import {
  getAvailableSlots as computeSlots,
  hostStartOfToday,
} from "@/lib/scheduling/slots";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  const slug = request.nextUrl.searchParams.get("slug");
  const timezone = request.nextUrl.searchParams.get("timezone") ?? "America/New_York";

  if (!username || !slug) {
    return NextResponse.json({ error: "Missing username or slug" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: host } = await admin
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!host) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { data: eventType } = await admin
    .from("event_types")
    .select("*")
    .eq("user_id", host.id)
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!eventType) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const fromDate = hostStartOfToday(host.timezone);
  const toDate = addDays(fromDate, eventType.max_days_ahead);

  const slots = await computeSlots({
    hostId: host.id,
    hostTimezone: host.timezone,
    eventType,
    fromDate,
    toDate,
  });

  const grouped = groupSlotsByDate(slots, timezone);
  const serializedSlots = Object.fromEntries(
    Object.entries(grouped).map(([dateKey, daySlots]) => [
      dateKey,
      daySlots.map((slot) => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
      })),
    ]),
  );

  return NextResponse.json({
    host: {
      name: host.name,
      username: host.username,
      timezone: host.timezone,
      image: host.avatar_url,
    },
    eventType: {
      id: eventType.id,
      title: eventType.title,
      slug: eventType.slug,
      description: eventType.description,
      duration: eventType.duration,
      location: eventType.location,
    },
    slots: serializedSlots,
  });
}

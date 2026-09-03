import { NextRequest, NextResponse } from "next/server";
import { endOfWeek, startOfWeek } from "date-fns";
import { requireAuth } from "@/lib/api-utils";
import { mergeCalendarEvents } from "@/lib/calendar/merge-events";
import { isGoogleCalendarConnected, listGoogleCalendarEvents } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const fromParam = request.nextUrl.searchParams.get("from");
  const toParam = request.nextUrl.searchParams.get("to");

  const fromDate = fromParam ? new Date(fromParam) : startOfWeek(new Date(), { weekStartsOn: 1 });
  const toDate = toParam ? new Date(toParam) : endOfWeek(new Date(), { weekStartsOn: 1 });

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
  }

  const [{ data: bookings, error }, googleCalendarConnected] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, guest_name, guest_email, start_time, end_time, google_event_id, event_types(title)")
      .eq("host_id", user!.id)
      .eq("status", "confirmed")
      .gte("start_time", fromDate.toISOString())
      .lte("start_time", toDate.toISOString())
      .order("start_time", { ascending: true }),
    isGoogleCalendarConnected(user!.id),
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const googleEvents = googleCalendarConnected
    ? await listGoogleCalendarEvents(user!.id, fromDate, toDate)
    : [];

  const normalizedBookings = (bookings ?? []).map((booking) => ({
    ...booking,
    event_types: Array.isArray(booking.event_types)
      ? (booking.event_types[0] ?? null)
      : booking.event_types,
  }));

  const events = mergeCalendarEvents(normalizedBookings, googleEvents);

  return NextResponse.json({
    events,
    googleCalendarConnected,
    range: {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    },
  });
}

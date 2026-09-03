export type CalendarEventSource = "meetly" | "google";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  source: CalendarEventSource;
  guestName?: string | null;
  guestEmail?: string | null;
  eventTypeTitle?: string | null;
  location?: string | null;
  htmlLink?: string | null;
  bookingId?: string;
};

type MeetlyBooking = {
  id: string;
  guest_name: string;
  guest_email: string;
  start_time: string;
  end_time: string;
  google_event_id: string | null;
  event_types: { title: string } | null;
};

type GoogleEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string | null;
  htmlLink: string | null;
};

export function mergeCalendarEvents(
  bookings: MeetlyBooking[],
  googleEvents: GoogleEvent[],
): CalendarEvent[] {
  const linkedGoogleIds = new Set(
    bookings.map((booking) => booking.google_event_id).filter(Boolean) as string[],
  );

  const meetlyEvents: CalendarEvent[] = bookings.map((booking) => ({
    id: `meetly-${booking.id}`,
    bookingId: booking.id,
    title: `${booking.event_types?.title ?? "Meeting"} with ${booking.guest_name}`,
    start: booking.start_time,
    end: booking.end_time,
    source: "meetly",
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    eventTypeTitle: booking.event_types?.title ?? null,
  }));

  const externalGoogleEvents: CalendarEvent[] = googleEvents
    .filter((event) => !linkedGoogleIds.has(event.id))
    .map((event) => ({
      id: `google-${event.id}`,
      title: event.title,
      start: event.start,
      end: event.end,
      source: "google",
      location: event.location,
      htmlLink: event.htmlLink,
    }));

  return [...meetlyEvents, ...externalGoogleEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}

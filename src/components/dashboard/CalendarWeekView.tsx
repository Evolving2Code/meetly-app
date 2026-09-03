"use client";

import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  source: "meetly" | "google";
  guestName?: string | null;
  guestEmail?: string | null;
  htmlLink?: string | null;
  location?: string | null;
};

export function CalendarWeekView() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        from: weekStart.toISOString(),
        to: weekEnd.toISOString(),
      });

      const response = await fetch(`/api/calendar/events?${params.toString()}`);
      setLoading(false);

      if (!response.ok) {
        setError("Could not load calendar events.");
        return;
      }

      const data = await response.json();
      setEvents(data.events ?? []);
      setGoogleConnected(Boolean(data.googleCalendarConnected));
    }

    loadEvents();
  }, [weekStart]);

  const eventsByDay = useMemo(() => {
    return days.map((day) => ({
      day,
      events: events.filter((event) => isSameDay(new Date(event.start), day)),
    }));
  }, [days, events]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => setWeekStart((current) => subWeeks(current, 1))}
          >
            ←
          </button>
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Today
          </button>
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => setWeekStart((current) => addWeeks(current, 1))}
          >
            →
          </button>
        </div>

        <p className="text-sm font-semibold text-navy">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-lime" />
          Meetly bookings
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary" />
          Google Calendar
        </span>
      </div>

      {!googleConnected && (
        <div className="rounded-2xl border border-border bg-surface px-4 py-4 text-sm text-muted">
          Connect Google Calendar in{" "}
          <Link href="/dashboard/settings" className="font-semibold text-primary hover:underline">
            Settings
          </Link>{" "}
          to see your full schedule alongside Meetly bookings.
        </div>
      )}

      {loading ? (
        <div className="card text-center text-muted">Loading calendar...</div>
      ) : error ? (
        <div className="card text-center text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {eventsByDay.map(({ day, events: dayEvents }) => (
            <section key={day.toISOString()} className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-navy">{format(day, "EEEE, MMM d")}</h2>
                {isSameDay(day, new Date()) && <span className="badge-lime">Today</span>}
              </div>

              {dayEvents.length === 0 ? (
                <p className="text-sm text-muted">No events</p>
              ) : (
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <CalendarEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function CalendarEventCard({ event }: { event: CalendarEvent }) {
  const content = (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        event.source === "meetly"
          ? "border-lime/40 bg-lime/10"
          : "border-primary/20 bg-primary-light/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-navy">{event.title}</p>
          <p className="mt-1 text-sm text-muted">
            {format(new Date(event.start), "h:mm a")} – {format(new Date(event.end), "h:mm a")}
          </p>
          {event.guestEmail && (
            <p className="mt-1 text-sm text-muted">{event.guestEmail}</p>
          )}
          {event.location && <p className="mt-1 text-sm text-muted">{event.location}</p>}
        </div>
        <span
          className={
            event.source === "meetly" ? "badge-lime" : "badge bg-primary-light text-primary-dark"
          }
        >
          {event.source === "meetly" ? "Meetly" : "Google"}
        </span>
      </div>
    </div>
  );

  if (event.source === "google" && event.htmlLink) {
    return (
      <a href={event.htmlLink} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

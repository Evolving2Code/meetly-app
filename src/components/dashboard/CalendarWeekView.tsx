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
import type { CalendarEvent } from "@/lib/calendar/merge-events";
import { CalendarEmptyIcon, EmptyState } from "@/components/ui/EmptyState";
import { CalendarSkeleton } from "@/components/ui/Skeleton";
import { CalendarEventCard } from "./CalendarEventCard";

export function CalendarWeekView({
  weekStart,
  onWeekStartChange,
}: {
  weekStart: Date;
  onWeekStartChange: (date: Date) => void;
}) {
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

  const totalEvents = events.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => onWeekStartChange(subWeeks(weekStart, 1))}
          >
            ←
          </button>
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => onWeekStartChange(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Today
          </button>
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => onWeekStartChange(addWeeks(weekStart, 1))}
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
        <CalendarSkeleton />
      ) : error ? (
        <div className="card text-center text-red-600">{error}</div>
      ) : totalEvents === 0 ? (
        <EmptyState
          icon={<CalendarEmptyIcon />}
          title="No events this week"
          description={
            googleConnected
              ? "Your calendar is clear for this week."
              : "Connect Google Calendar or wait for new Meetly bookings to appear here."
          }
          action={
            googleConnected
              ? undefined
              : { label: "Connect Google Calendar", href: "/dashboard/settings" }
          }
        />
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

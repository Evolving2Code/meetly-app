"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/lib/calendar/merge-events";
import { CalendarEventCard } from "./CalendarEventCard";

export function CalendarMonthView({
  monthStart,
  onMonthStartChange,
}: {
  monthStart: Date;
  onMonthStartChange: (date: Date) => void;
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthEnd = endOfMonth(monthStart);
  const gridStart = useMemo(() => startOfWeek(monthStart, { weekStartsOn: 1 }), [monthStart]);
  const gridEnd = useMemo(() => endOfWeek(monthEnd, { weekStartsOn: 1 }), [monthEnd]);
  const days = useMemo(
    () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart, gridEnd],
  );

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        from: gridStart.toISOString(),
        to: gridEnd.toISOString(),
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
  }, [monthStart, gridStart, gridEnd]);

  const eventsByDay = useMemo(() => {
    return days.map((day) => ({
      day,
      events: events.filter((event) => isSameDay(new Date(event.start), day)),
    }));
  }, [days, events]);

  const selectedDayEvents =
    eventsByDay.find(({ day }) => selectedDay && isSameDay(day, selectedDay))?.events ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => onMonthStartChange(subMonths(monthStart, 1))}
          >
            ←
          </button>
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => onMonthStartChange(startOfMonth(new Date()))}
          >
            Today
          </button>
          <button
            type="button"
            className="btn-secondary min-h-[44px] px-4"
            onClick={() => onMonthStartChange(addMonths(monthStart, 1))}
          >
            →
          </button>
        </div>

        <p className="text-sm font-semibold text-navy">{format(monthStart, "MMMM yyyy")}</p>
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
        <>
          <div className="card overflow-x-auto">
            <div className="grid min-w-[720px] grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
                <div key={label} className="px-2 py-1 text-center text-xs font-semibold text-muted">
                  {label}
                </div>
              ))}

              {eventsByDay.map(({ day, events: dayEvents }) => {
                const inMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[96px] rounded-2xl border p-2 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary-light/30"
                        : "border-border bg-surface hover:border-primary/20"
                    } ${inMonth ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold ${
                          isToday ? "rounded-full bg-navy px-2 py-0.5 text-white" : "text-navy"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-xs font-semibold text-muted">{dayEvents.length}</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <p
                          key={event.id}
                          className={`truncate text-xs font-medium ${
                            event.source === "meetly" ? "text-lime-dark" : "text-primary-dark"
                          }`}
                        >
                          {format(new Date(event.start), "h:mm a")} {event.title}
                        </p>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-xs text-muted">+{dayEvents.length - 2} more</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDay && (
            <section className="card">
              <h2 className="mb-4 text-lg font-black text-navy">
                {format(selectedDay, "EEEE, MMM d, yyyy")}
              </h2>
              {selectedDayEvents.length === 0 ? (
                <p className="text-sm text-muted">No events</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <CalendarEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

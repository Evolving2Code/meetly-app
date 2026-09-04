"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MeetlyIcon } from "@/components/marketing/MeetlyIcon";
import { BookingDateCalendar } from "@/components/booking/BookingDateCalendar";
import { getHostThemeStyle } from "@/lib/branding/colors";
import { formatDateKeyLabel, formatDateLabel, formatSlotLabel } from "@/lib/scheduling/format";
import {
  detectBrowserTimezone,
  formatTimezoneLabel,
  getTimezoneOptions,
} from "@/lib/scheduling/timezones";

type RescheduleFlowProps = {
  cancelToken: string;
  host: {
    name: string | null;
    username: string;
    image: string | null;
    timezone: string;
  };
  eventType: {
    title: string;
    slug: string;
    duration: number;
    location: string | null;
  };
  currentStartTime: string;
  guestTimezone: string;
};

export function RescheduleFlow({
  cancelToken,
  host,
  eventType,
  currentStartTime,
  guestTimezone,
}: RescheduleFlowProps) {
  const [timezone, setTimezone] = useState(guestTimezone || detectBrowserTimezone());
  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, Array<{ start: string; end: string }>>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [step, setStep] = useState<"date" | "time" | "confirmed">("date");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedStartTime, setConfirmedStartTime] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await fetch(
      `/api/slots?username=${encodeURIComponent(host.username)}&slug=${encodeURIComponent(eventType.slug)}&timezone=${encodeURIComponent(timezone)}`,
    );

    setLoading(false);

    if (!response.ok) {
      setError("Could not load available times.");
      return;
    }

    const data = await response.json();
    setSlotsByDate(data.slots ?? {});
  }, [host.username, eventType.slug, timezone]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const availableDates = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate]);
  const timesForSelectedDate = selectedDate ? slotsByDate[selectedDate] ?? [] : [];

  async function submitReschedule() {
    if (!selectedSlot) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/bookings/reschedule", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: cancelToken,
        startTime: selectedSlot.start,
        timezone,
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json();

      if (response.status === 409) {
        await loadSlots();
        setSelectedSlot(null);
        setStep("time");
        setError("That time was just booked. Please choose another available slot.");
        return;
      }

      setError(data.error ?? "Could not reschedule booking.");
      return;
    }

    const booking = await response.json();
    setConfirmedStartTime(booking.startTime ?? booking.start_time);
    setStep("confirmed");
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <MeetlyIcon className="h-9 w-9" />
          <span className="text-base font-bold text-navy">Meetly</span>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark">Reschedule</p>
        <h1 className="mt-1 text-3xl font-black text-navy">
          {step === "confirmed" ? "Meeting rescheduled" : "Pick a new time"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {eventType.title} with {host.name ?? host.username}
        </p>
        <p className="mt-1 text-sm text-muted">
          Current time: {formatDateLabel(new Date(currentStartTime), timezone)} at{" "}
          {formatSlotLabel(new Date(currentStartTime), timezone)}
        </p>

        <div className="mt-6">
          <label className="block max-w-sm">
            <span className="label">Your timezone</span>
            <select
              className="input"
              value={timezoneOptions.includes(timezone) ? timezone : timezoneOptions[0]}
              onChange={(event) => setTimezone(event.target.value)}
            >
              {timezoneOptions.map((zone) => (
                <option key={zone} value={zone}>
                  {formatTimezoneLabel(zone)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="card mt-6 text-center text-muted">Loading available times...</div>
        ) : step === "confirmed" && confirmedStartTime ? (
          <section className="card mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
              Updated
            </p>
            <p className="mt-3 text-lg font-bold text-navy">
              {formatDateLabel(new Date(confirmedStartTime), timezone)} at{" "}
              {formatSlotLabel(new Date(confirmedStartTime), timezone)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/api/bookings/ics?token=${encodeURIComponent(cancelToken)}`}
                className="btn-secondary min-h-[44px]"
              >
                Add to calendar (.ics)
              </a>
              <Link href={`/cancel/${cancelToken}`} className="btn-secondary min-h-[44px]">
                Manage booking
              </Link>
            </div>
          </section>
        ) : step === "date" ? (
          <section className="card mt-6">
            <h2 className="text-xl font-black">Select a new date</h2>
            <div className="mt-6">
              <BookingDateCalendar
                availableDates={availableDates}
                timezone={timezone}
                selectedDate={selectedDate}
                onSelectDate={(dateKey) => {
                  setSelectedDate(dateKey);
                  setStep("time");
                }}
              />
            </div>
          </section>
        ) : (
          <section className="card mt-6">
            <button
              type="button"
              className="mb-4 min-h-[44px] text-sm font-semibold text-lime-dark hover:underline"
              onClick={() => setStep("date")}
            >
              ← Back to calendar
            </button>
            <h2 className="text-xl font-black">
              {selectedDate ? formatDateKeyLabel(selectedDate, timezone) : "Select a new time"}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {timesForSelectedDate.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  className={`min-h-[48px] rounded-xl border px-3 py-3 text-sm font-bold transition ${
                    selectedSlot?.start === slot.start
                      ? "border-lime bg-lime text-navy"
                      : "border-border text-navy hover:border-lime hover:bg-lime"
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {formatSlotLabel(new Date(slot.start), timezone)}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-primary mt-6 min-h-[44px]"
              disabled={submitting || !selectedSlot}
              onClick={submitReschedule}
            >
              {submitting ? "Rescheduling..." : "Confirm new time"}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

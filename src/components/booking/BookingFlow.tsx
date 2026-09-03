"use client";

import { MeetlyIcon } from "@/components/marketing/MeetlyIcon";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BookingDateCalendar } from "@/components/booking/BookingDateCalendar";
import { formatDateKeyLabel, formatDateLabel, formatSlotLabel } from "@/lib/scheduling/format";
import { findSlotByDateAndTime } from "@/lib/scheduling/booking-params";
import {
  detectBrowserTimezone,
  formatTimezoneLabel,
  getTimezoneOptions,
} from "@/lib/scheduling/timezones";

type Host = {
  name: string | null;
  username: string;
  image: string | null;
  timezone: string;
};

type EventType = {
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  location: string | null;
};

type BookingStep = "date" | "time" | "details" | "confirmed";

export function BookingFlow({
  host,
  eventType,
  prefilledEmail,
  prefilledName,
  prefilledDate,
  prefilledTime,
}: {
  host: Host;
  eventType: EventType;
  prefilledEmail?: string;
  prefilledName?: string;
  prefilledDate?: string;
  prefilledTime?: string;
}) {
  const [step, setStep] = useState<BookingStep>("date");
  const [timezone, setTimezone] = useState(() => detectBrowserTimezone());
  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, Array<{ start: string; end: string }>>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(prefilledDate ?? null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [guestName, setGuestName] = useState(prefilledName ?? "");
  const [guestEmail, setGuestEmail] = useState(prefilledEmail ?? "");
  const [guestNotes, setGuestNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    cancelToken: string;
    startTime: string;
  } | null>(null);
  const [prefillApplied, setPrefillApplied] = useState(false);

  useEffect(() => {
    if (prefilledName) {
      setGuestName(prefilledName);
    }
  }, [prefilledName]);

  useEffect(() => {
    if (prefilledEmail) {
      setGuestEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await fetch(
      `/api/slots?username=${encodeURIComponent(host.username)}&slug=${encodeURIComponent(eventType.slug)}&timezone=${encodeURIComponent(timezone)}`,
    );

    setLoading(false);

    if (!response.ok) {
      setError("Could not load available times.");
      return null;
    }

    const data = await response.json();
    const slots = (data.slots ?? {}) as Record<string, Array<{ start: string; end: string }>>;
    setSlotsByDate(slots);
    return slots;
  }, [host.username, eventType.slug, timezone]);

  useEffect(() => {
    loadSlots().then((slots) => {
      if (!slots) {
        return;
      }

      setSelectedSlot(null);

      if (!prefillApplied && prefilledDate && slots[prefilledDate]) {
        setSelectedDate(prefilledDate);

        if (prefilledTime) {
          const matchedSlot = findSlotByDateAndTime(slots, prefilledDate, prefilledTime, timezone);

          if (matchedSlot) {
            setSelectedSlot(matchedSlot);
            setStep(prefilledEmail && prefilledName ? "details" : "time");
            setPrefillApplied(true);
            return;
          }
        }

        setStep("time");
        setPrefillApplied(true);
        return;
      }

      setSelectedDate(null);
      setStep("date");
    });
  }, [loadSlots, prefilledDate, prefilledTime, prefillApplied, prefilledEmail, prefilledName, timezone]);

  const availableDates = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate]);
  const timesForSelectedDate = selectedDate ? slotsByDate[selectedDate] ?? [] : [];

  async function submitBooking() {
    if (!selectedSlot) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: host.username,
        slug: eventType.slug,
        guestName,
        guestEmail,
        guestNotes,
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

      setError(data.error ?? "Could not complete booking.");
      return;
    }

    const booking = await response.json();
    setConfirmation({
      cancelToken: booking.cancelToken ?? booking.cancel_token,
      startTime: booking.startTime ?? booking.start_time,
    });
    setStep("confirmed");
  }

  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[minmax(0,420px)_1fr]">
      <aside className="bg-navy p-5 text-white sm:p-8 lg:p-10">
        <div className="mb-6 flex items-center gap-3 lg:mb-10">
          <MeetlyIcon className="h-10 w-10" />
          <span className="text-lg font-bold">Meetly</span>
        </div>

        <div className="flex items-center gap-4">
          {host.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={host.image}
              alt={host.name ?? host.username}
              className="h-14 w-14 rounded-full border-2 border-lime sm:h-16 sm:w-16"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-xl font-black text-navy sm:h-16 sm:w-16 sm:text-2xl">
              {(host.name ?? host.username).slice(0, 1)}
            </div>
          )}
          <div>
            <p className="text-sm text-slate-400">Book with</p>
            <p className="text-xl font-black sm:text-2xl">{host.name ?? host.username}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-10 sm:space-y-0 lg:grid-cols-1 lg:gap-0 lg:space-y-5">
          <InfoBlock label="Meeting" value={eventType.title} />
          <InfoBlock label="Duration" value={`${eventType.duration} min`} />
          <InfoBlock label="Location" value={eventType.location ?? "Video call"} />
          <InfoBlock label="Timezone" value={host.timezone} />
        </div>

        {eventType.description && (
          <p className="mt-6 hidden text-sm leading-6 text-slate-300 sm:block">{eventType.description}</p>
        )}

        <div className="mt-6 rounded-2xl bg-navy-light p-4 sm:mt-10 sm:p-5">
          <StepIndicator step={step} />
        </div>
      </aside>

      <main className="flex-1 bg-white p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
                Guest booking
              </p>
              <h1 className="mt-1 text-2xl font-black text-navy sm:mt-2 sm:text-3xl">
                {step === "confirmed" ? "You’re booked" : "Pick a time"}
              </h1>
            </div>
            <label className="block w-full sm:w-auto">
              <span className="label">Your timezone</span>
              <select
                className="input sm:min-w-56"
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
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="card text-center text-muted">Loading available times...</div>
          ) : step === "confirmed" && confirmation ? (
            <ConfirmationPanel
              hostName={host.name ?? host.username}
              eventTitle={eventType.title}
              startTime={confirmation.startTime}
              timezone={timezone}
              cancelToken={confirmation.cancelToken}
            />
          ) : step === "date" ? (
            <section className="card">
              <h2 className="text-xl font-black">Select a date</h2>
              {availableDates.length === 0 ? (
                <p className="mt-4 text-muted">No available dates right now.</p>
              ) : (
                <div className="mt-6">
                  <BookingDateCalendar
                    availableDates={availableDates}
                    timezone={timezone}
                    selectedDate={selectedDate}
                    initialMonth={prefilledDate}
                    onSelectDate={(dateKey) => {
                      setSelectedDate(dateKey);
                      setStep("time");
                    }}
                  />
                </div>
              )}
            </section>
          ) : step === "time" ? (
            <section className="card">
              <button
                type="button"
                className="mb-4 min-h-[44px] text-sm font-semibold text-lime-dark hover:underline"
                onClick={() => setStep("date")}
              >
                ← Back to calendar
              </button>
              <h2 className="text-xl font-black">
                {selectedDate ? formatDateKeyLabel(selectedDate, timezone) : "Select a time"}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {timesForSelectedDate.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    className={`min-h-[48px] rounded-xl border px-3 py-3 text-sm font-bold transition active:scale-[0.98] ${
                      selectedSlot?.start === slot.start
                        ? "border-lime bg-lime text-navy"
                        : "border-border text-navy hover:border-lime hover:bg-lime"
                    }`}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep("details");
                    }}
                  >
                    {formatSlotLabel(new Date(slot.start), timezone)}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="card">
              <button
                type="button"
                className="mb-4 text-sm font-semibold text-lime-dark hover:underline"
                onClick={() => setStep("time")}
              >
                ← Back to times
              </button>
              <h2 className="text-xl font-black">Your details</h2>
              {selectedSlot && (
                <p className="mt-2 text-sm text-muted">
                  {formatDateLabel(new Date(selectedSlot.start), timezone)} at{" "}
                  {formatSlotLabel(new Date(selectedSlot.start), timezone)}
                </p>
              )}

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="label">Name</span>
                  <input
                    className="input"
                    name="name"
                    autoComplete="name"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="label">Email</span>
                  <input
                    className="input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                  />
                  {prefilledEmail && guestEmail === prefilledEmail && (
                    <p className="mt-2 text-xs text-muted">
                      Prefilled from your booking link. You can edit it if needed.
                    </p>
                  )}
                </label>
                <label className="block">
                  <span className="label">Notes (optional)</span>
                  <textarea
                    className="input min-h-24"
                    value={guestNotes}
                    onChange={(event) => setGuestNotes(event.target.value)}
                  />
                </label>

                <p className="text-xs leading-relaxed text-muted">
                  By confirming, you agree that your name, email, and any notes you provide will
                  be shared with {host.name ?? host.username} for scheduling purposes and processed
                  by Meetly as described in our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <button
                  type="button"
                  className="btn-primary w-full py-3"
                  disabled={submitting || !guestName || !guestEmail || !selectedSlot}
                  onClick={submitBooking}
                >
                  {submitting ? "Booking..." : "Confirm booking"}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

function StepIndicator({ step }: { step: BookingStep }) {
  const steps = [
    { id: "date", label: "Date" },
    { id: "time", label: "Time" },
    { id: "details", label: "Details" },
    { id: "confirmed", label: "Done" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((item) => {
        const active = item.id === step;
        const completed =
          steps.findIndex((entry) => entry.id === step) >
          steps.findIndex((entry) => entry.id === item.id);

        return (
          <div key={item.id} className="text-center">
            <div
              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                active || completed ? "bg-lime text-navy" : "bg-slate-700 text-slate-300"
              }`}
            >
              {steps.findIndex((entry) => entry.id === item.id) + 1}
            </div>
            <p className="text-xs font-semibold text-slate-300">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function ConfirmationPanel({
  hostName,
  eventTitle,
  startTime,
  timezone,
  cancelToken,
}: {
  hostName: string;
  eventTitle: string;
  startTime: string;
  timezone: string;
  cancelToken: string;
}) {
  const [cancelled, setCancelled] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function cancelBooking() {
    setCancelling(true);
    const response = await fetch(`/api/bookings?token=${encodeURIComponent(cancelToken)}`, {
      method: "DELETE",
    });
    setCancelling(false);

    if (response.ok) {
      setCancelled(true);
    }
  }

  return (
    <section className="card">
      <div className="rounded-2xl bg-lime/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
          Confirmed
        </p>
        <h2 className="mt-2 text-2xl font-black text-navy">
          {eventTitle} with {hostName}
        </h2>
        <p className="mt-3 text-muted">
          {formatDateLabel(new Date(startTime), timezone)} at{" "}
          {formatSlotLabel(new Date(startTime), timezone)} ({timezone})
        </p>
        <p className="mt-4 text-sm text-muted">
          A calendar invite has been sent if Google Calendar is connected. You can also add this
          meeting to your calendar manually.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`/api/bookings/ics?token=${encodeURIComponent(cancelToken)}`}
          className="btn-secondary min-h-[44px]"
        >
          Add to calendar (.ics)
        </a>
        <Link href={`/reschedule/${cancelToken}`} className="btn-secondary min-h-[44px]">
          Reschedule
        </Link>
      </div>

      {!cancelled ? (
        <button
          type="button"
          className="btn-secondary mt-6"
          disabled={cancelling}
          onClick={cancelBooking}
        >
          {cancelling ? "Cancelling..." : "Cancel booking"}
        </button>
      ) : (
        <p className="mt-6 text-sm font-semibold text-red-600">This booking has been cancelled.</p>
      )}
    </section>
  );
}

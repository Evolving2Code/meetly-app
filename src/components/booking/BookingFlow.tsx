"use client";

import { MeetlyIcon } from "@/components/marketing/MeetlyIcon";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BookingDateCalendar } from "@/components/booking/BookingDateCalendar";
import { CalendarActionButtons } from "@/components/booking/CalendarActionButtons";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingFlowMainSkeleton } from "@/components/ui/Skeleton";
import { formatDateKeyLabel, formatDateLabel, formatSlotLabel } from "@/lib/scheduling/format";
import { findSlotByDateAndTime } from "@/lib/scheduling/booking-params";
import { getHostThemeStyle } from "@/lib/branding/colors";
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
  brandColor?: string | null;
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

  function handleSelectDate(dateKey: string) {
    setSelectedDate(dateKey);
    setSelectedSlot(null);

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setStep("time");
    }
  }

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
      <aside
        className="booking-host-aside flex flex-col p-5 text-white sm:p-8 lg:p-10"
        style={getHostThemeStyle(host.brandColor)}
      >
        <div className="flex items-center gap-4">
          {host.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={host.image}
              alt={host.name ?? host.username}
              className="h-16 w-16 rounded-full border-2 border-lime sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-2xl font-black text-navy sm:h-20 sm:w-20 sm:text-3xl">
              {(host.name ?? host.username).slice(0, 1)}
            </div>
          )}
          <div>
            <p className="text-sm text-slate-400">Book with</p>
            <p className="text-2xl font-black sm:text-3xl">{host.name ?? host.username}</p>
            <p className="mt-1 text-sm font-semibold text-lime">{eventType.title}</p>
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

        <div className="mt-6 rounded-2xl booking-host-panel p-4 sm:mt-10 sm:p-5">
          <StepIndicator step={step} />
        </div>

        {(selectedDate || selectedSlot || (step === "details" && (guestName || guestEmail))) && (
          <div className="mt-6 space-y-3 border-t border-slate-700 pt-6 sm:mt-8">
            {selectedDate && (
              <SummaryRow
                icon={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                }
                label="Date"
                value={formatDateKeyLabel(selectedDate, timezone)}
              />
            )}
            {selectedSlot && (
              <SummaryRow
                icon={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                }
                label="Time"
                value={formatSlotLabel(new Date(selectedSlot.start), timezone)}
              />
            )}
            {step === "details" && (guestName || guestEmail) && (
              <SummaryRow
                icon={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                }
                label="Guest"
                value={guestName || guestEmail}
                detail={guestName && guestEmail ? guestEmail : undefined}
              />
            )}
          </div>
        )}

        <p className="mt-auto flex items-center gap-2 pt-8 text-xs text-slate-500">
          <MeetlyIcon className="h-4 w-4 opacity-70" />
          <span>
            Powered by{" "}
            <Link href="/" className="text-slate-400 transition hover:text-white">
              Meetly
            </Link>
          </span>
        </p>
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
            <BookingFlowMainSkeleton />
          ) : step === "confirmed" && confirmation ? (
            <ConfirmationPanel
              hostName={host.name ?? host.username}
              eventTitle={eventType.title}
              startTime={confirmation.startTime}
              duration={eventType.duration}
              location={eventType.location}
              timezone={timezone}
              cancelToken={confirmation.cancelToken}
            />
          ) : step === "date" || step === "time" ? (
            <section className="card">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div className={step === "time" ? "hidden lg:block" : ""}>
                  <h2 className="text-xl font-black">Select a date</h2>
                  {availableDates.length === 0 ? (
                    <div className="mt-6">
                      <EmptyState
                        title="No times available"
                        description="There are no open slots in the next 60 days. Please check back later or contact the host."
                      />
                    </div>
                  ) : (
                    <div className="mt-6">
                      <BookingDateCalendar
                        availableDates={availableDates}
                        timezone={timezone}
                        selectedDate={selectedDate}
                        initialMonth={prefilledDate}
                        onSelectDate={handleSelectDate}
                      />
                    </div>
                  )}
                </div>

                <div className={step === "date" ? "hidden lg:block" : ""}>
                  {step === "time" && (
                    <button
                      type="button"
                      className="mb-4 min-h-[44px] text-sm font-semibold text-lime-dark hover:underline lg:hidden"
                      onClick={() => setStep("date")}
                    >
                      ← Back to calendar
                    </button>
                  )}
                  <h2 className="text-xl font-black">
                    {selectedDate ? formatDateKeyLabel(selectedDate, timezone) : "Select a time"}
                  </h2>
                  {!selectedDate ? (
                    <p className="mt-4 text-sm text-muted">
                      Choose a date to see available times.
                    </p>
                  ) : (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
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
                  )}
                </div>
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

function SummaryRow({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        {icon}
      </svg>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="mt-0.5 font-semibold text-slate-100">{value}</p>
        {detail && <p className="truncate text-xs text-slate-400">{detail}</p>}
      </div>
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
  duration,
  location,
  timezone,
  cancelToken,
}: {
  hostName: string;
  eventTitle: string;
  startTime: string;
  duration: number;
  location?: string | null;
  timezone: string;
  cancelToken: string;
}) {
  const [cancelled, setCancelled] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const endTime = new Date(new Date(startTime).getTime() + duration * 60_000).toISOString();
  const icsUrl = `/api/bookings/ics?token=${encodeURIComponent(cancelToken)}`;

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
      <div className="animate-success-pop rounded-2xl bg-lime/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-navy">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path
                className="animate-success-check"
                d="M5 12l5 5L20 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
            Confirmed
          </p>
        </div>
        <h2 className="mt-4 text-2xl font-black text-navy">
          {eventTitle} with {hostName}
        </h2>
        <p className="mt-3 text-muted">
          {formatDateLabel(new Date(startTime), timezone)} at{" "}
          {formatSlotLabel(new Date(startTime), timezone)} ({timezone})
        </p>
        <p className="mt-4 text-sm text-muted">
          A calendar invite has been sent if Google Calendar is connected. Add this meeting to your
          calendar below.
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-navy">Add to calendar</p>
        <CalendarActionButtons
          eventTitle={eventTitle}
          hostName={hostName}
          startTime={startTime}
          endTime={endTime}
          icsUrl={icsUrl}
          location={location}
        />
      </div>

      <div className="mt-6">
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

"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BookingDateCalendar } from "@/components/booking/BookingDateCalendar";
import { CalendarActionButtons } from "@/components/booking/CalendarActionButtons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Alert } from "@/components/ui/Alert";
import { formatDateLabel, formatSlotLabel } from "@/lib/scheduling/format";
import type { EventType } from "@/lib/supabase/types";

type BookingDetail = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_notes: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  cancel_token: string;
  event_types: EventType | null;
};

export function BookingDetailView({
  booking,
  hostUsername,
}: {
  booking: BookingDetail;
  hostUsername: string | null;
}) {
  const router = useRouter();
  const [showReschedule, setShowReschedule] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isUpcoming = new Date(booking.start_time) > new Date() && booking.status === "confirmed";
  const icsUrl = `/api/bookings/ics?token=${encodeURIComponent(booking.cancel_token)}`;
  const publicBookingUrl =
    hostUsername && booking.event_types?.slug
      ? `/book/${hostUsername}/${booking.event_types.slug}`
      : null;

  async function cancelBooking() {
    setCancelling(true);
    setError(null);

    const response = await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
    setCancelling(false);
    setPendingCancel(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not cancel booking.");
      return;
    }

    router.push("/dashboard/bookings");
    router.refresh();
  }

  return (
    <>
      <div className="card max-w-3xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark">
              {booking.status === "cancelled" ? "Cancelled" : isUpcoming ? "Upcoming" : "Past"}
            </p>
            <h1 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
              {booking.event_types?.title ?? "Meeting"}
            </h1>
            <p className="mt-2 text-muted">with {booking.guest_name}</p>
          </div>
          <span className="badge-lime">{booking.event_types?.duration ?? "—"} min</span>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <DetailItem
            label="When"
            value={`${format(new Date(booking.start_time), "EEE, MMM d, yyyy")} · ${format(
              new Date(booking.start_time),
              "h:mm a",
            )} – ${format(new Date(booking.end_time), "h:mm a")}`}
            detail={booking.timezone}
          />
          <DetailItem label="Guest email" value={booking.guest_email} />
          {booking.guest_notes && <DetailItem label="Notes" value={booking.guest_notes} />}
          {booking.event_types?.location && (
            <DetailItem label="Location" value={booking.event_types.location} />
          )}
        </dl>

        {error && (
          <Alert variant="error" className="mt-6">
            {error}
          </Alert>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/contacts/${encodeURIComponent(booking.guest_email)}`}
            className="btn-secondary"
          >
            View contact
          </Link>
          <a href={icsUrl} className="btn-secondary">
            Add to calendar
          </a>
          {publicBookingUrl && (
            <Link href={publicBookingUrl} className="btn-secondary" target="_blank">
              Preview booking page
            </Link>
          )}
          <a
            href={`/cancel/${booking.cancel_token}`}
            className="btn-secondary"
            target="_blank"
            rel="noreferrer"
          >
            Guest manage link
          </a>
        </div>

        {isUpcoming && (
          <div className="mt-8 border-t border-border pt-8">
            <p className="mb-3 text-sm font-semibold text-foreground">Add to calendar</p>
            <CalendarActionButtons
              eventTitle={booking.event_types?.title ?? "Meeting"}
              hostName={booking.guest_name}
              startTime={booking.start_time}
              endTime={booking.end_time}
              icsUrl={icsUrl}
              location={booking.event_types?.location}
            />
          </div>
        )}

        {isUpcoming && (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-8">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowReschedule((current) => !current)}
            >
              {showReschedule ? "Hide reschedule" : "Reschedule"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setPendingCancel(true)}>
              Cancel booking
            </button>
          </div>
        )}

        {showReschedule && isUpcoming && hostUsername && booking.event_types?.slug && (
          <HostReschedulePanel
            bookingId={booking.id}
            username={hostUsername}
            slug={booking.event_types.slug}
            timezone={booking.timezone}
            onSuccess={() => {
              setShowReschedule(false);
              router.refresh();
            }}
            onError={setError}
          />
        )}
      </div>

      <ConfirmDialog
        open={pendingCancel}
        title="Cancel this booking?"
        description={`The meeting with ${booking.guest_name} will be cancelled and removed from your calendar.`}
        confirmLabel="Cancel booking"
        variant="destructive"
        loading={cancelling}
        onCancel={() => setPendingCancel(false)}
        onConfirm={cancelBooking}
      />
    </>
  );
}

function DetailItem({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-2 font-semibold text-foreground">{value}</dd>
      {detail && <dd className="mt-1 text-sm text-muted">{detail}</dd>}
    </div>
  );
}

function HostReschedulePanel({
  bookingId,
  username,
  slug,
  timezone: initialTimezone,
  onSuccess,
  onError,
}: {
  bookingId: string;
  username: string;
  slug: string;
  timezone: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const [timezone, setTimezone] = useState(initialTimezone);
  const [slotsByDate, setSlotsByDate] = useState<
    Record<string, Array<{ start: string; end: string }>>
  >({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadSlots = useCallback(
    async (nextTimezone: string) => {
      setLoading(true);
      onError("");

      const response = await fetch(
        `/api/slots?username=${encodeURIComponent(username)}&slug=${encodeURIComponent(slug)}&timezone=${encodeURIComponent(nextTimezone)}`,
      );
      setLoading(false);

      if (!response.ok) {
        onError("Could not load available times.");
        return;
      }

      const data = await response.json();
      setSlotsByDate(data.slots ?? {});
      setSelectedDate(null);
      setSelectedSlot(null);
    },
    [username, slug, onError],
  );

  useEffect(() => {
    void loadSlots(timezone);
  }, [loadSlots, timezone]);

  async function confirmReschedule() {
    if (!selectedSlot) {
      return;
    }

    setSubmitting(true);
    onError("");

    const response = await fetch(`/api/bookings/${bookingId}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startTime: selectedSlot.start, timezone }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      onError(data.error ?? "Could not reschedule booking.");
      if (response.status === 409) {
        void loadSlots(timezone);
      }
      return;
    }

    onSuccess();
  }

  const availableDates = Object.keys(slotsByDate);

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-lg font-black text-foreground">Pick a new time</h2>
      <label className="label mt-4">
        Timezone
        <input
          className="input mt-1"
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
        />
      </label>

      {loading ? (
        <p className="mt-4 text-sm text-muted">Loading available times...</p>
      ) : availableDates.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No open times in the booking window.</p>
      ) : (
        <>
          <div className="mt-4">
            <BookingDateCalendar
              availableDates={availableDates}
              timezone={timezone}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          {selectedDate && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(slotsByDate[selectedDate] ?? []).map((slot) => {
                const isSelected = selectedSlot?.start === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      isSelected
                        ? "border-lime bg-lime text-navy"
                        : "border-border bg-background text-foreground hover:border-lime hover:bg-lime/10"
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {formatSlotLabel(new Date(slot.start), timezone)}
                  </button>
                );
              })}
            </div>
          )}

          {selectedSlot && (
            <p className="mt-4 text-sm text-muted">
              New time: {formatDateLabel(new Date(selectedSlot.start), timezone)} at{" "}
              {formatSlotLabel(new Date(selectedSlot.start), timezone)}
            </p>
          )}

          <button
            type="button"
            className="btn-primary mt-4"
            disabled={!selectedSlot || submitting}
            onClick={confirmReschedule}
          >
            {submitting ? "Saving..." : "Confirm new time"}
          </button>
        </>
      )}
    </div>
  );
}
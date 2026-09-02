"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventType } from "@/lib/supabase/types";

type BookingRow = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_notes: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  cancel_token: string;
  event_types: EventType | null;
};

type Tab = "upcoming" | "past";

export function BookingsList() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/bookings?status=${tab}`);
      setLoading(false);

      if (!response.ok) {
        setError("Could not load bookings.");
        return;
      }

      const data = await response.json();
      setBookings(data);
    }

    loadBookings();
  }, [tab]);

  async function cancelBooking(bookingId: string, guestName: string) {
    const confirmed = window.confirm(`Cancel the meeting with ${guestName}?`);
    if (!confirmed) {
      return;
    }

    setCancellingId(bookingId);
    setError(null);

    const response = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });

    setCancellingId(null);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not cancel booking.");
      return;
    }

    setBookings((current) => current.filter((booking) => booking.id !== bookingId));
    router.refresh();
  }

  return (
    <div className="card max-w-4xl">
      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
          Upcoming
        </TabButton>
        <TabButton active={tab === "past"} onClick={() => setTab("past")}>
          Past
        </TabButton>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading bookings...</p>
      ) : !bookings.length ? (
        <div className="rounded-2xl bg-surface p-8 text-center">
          <p className="font-semibold text-navy">
            {tab === "upcoming" ? "No upcoming bookings" : "No past bookings yet"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {tab === "upcoming"
              ? "Share your booking link to start filling your calendar."
              : "Completed meetings will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-navy">{booking.guest_name}</p>
                  <p className="text-sm text-muted">{booking.guest_email}</p>
                  <p className="mt-2 text-sm font-semibold text-navy">
                    {booking.event_types?.title ?? "Meeting"}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {format(new Date(booking.start_time), "EEE, MMM d, yyyy")} ·{" "}
                    {format(new Date(booking.start_time), "h:mm a")} –{" "}
                    {format(new Date(booking.end_time), "h:mm a")}
                  </p>
                  {booking.guest_notes && (
                    <p className="mt-2 text-sm text-muted">Notes: {booking.guest_notes}</p>
                  )}
                </div>

                {tab === "upcoming" && (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="btn-secondary min-h-[44px]"
                      disabled={cancellingId === booking.id}
                      onClick={() => cancelBooking(booking.id, booking.guest_name)}
                    >
                      {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                    </button>
                    <a
                      href={`/cancel/${booking.cancel_token}`}
                      className="text-center text-xs font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Guest cancel link
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-navy text-white" : "bg-surface text-muted hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

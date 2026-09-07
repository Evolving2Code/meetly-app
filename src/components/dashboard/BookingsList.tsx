"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventType } from "@/lib/supabase/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Alert } from "@/components/ui/Alert";
import { BookingsEmptyIcon, EmptyState } from "@/components/ui/EmptyState";
import { BookingsListSkeleton } from "@/components/ui/Skeleton";
import { TabFilter } from "@/components/ui/TabFilter";

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
  const [pendingCancel, setPendingCancel] = useState<{ id: string; guestName: string } | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return bookings;
    }

    return bookings.filter((booking) => {
      const haystack = [
        booking.guest_name,
        booking.guest_email,
        booking.event_types?.title ?? "",
        booking.guest_notes ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [bookings, searchQuery]);

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

  async function cancelBooking(bookingId: string) {
    setCancellingId(bookingId);
    setError(null);

    const response = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });

    setCancellingId(null);
    setPendingCancel(null);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not cancel booking.");
      return;
    }

    setBookings((current) => current.filter((booking) => booking.id !== bookingId));
    router.refresh();
  }

  return (
    <>
      <div className="card max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <TabFilter
            items={[
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past" },
            ]}
            activeId={tab}
            onChange={(id) => setTab(id as Tab)}
          />
          <label className="block w-full sm:max-w-xs">
            <span className="label">Search bookings</span>
            <input
              className="input"
              type="search"
              placeholder="Name, email, or event type"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <BookingsListSkeleton />
        ) : !bookings.length ? (
          <EmptyState
            icon={<BookingsEmptyIcon />}
            title={tab === "upcoming" ? "No upcoming bookings" : "No past bookings yet"}
            description={
              tab === "upcoming"
                ? "Share your booking link to start filling your calendar."
                : "Completed meetings will appear here."
            }
            action={
              tab === "upcoming"
                ? { label: "Manage event types", href: "/dashboard/event-types" }
                : undefined
            }
          />
        ) : !filteredBookings.length ? (
          <EmptyState
            icon={<BookingsEmptyIcon />}
            title="No matching bookings"
            description={`Nothing matched "${searchQuery.trim()}". Try another name, email, or event type.`}
          />
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      <p className="font-bold text-foreground">{booking.guest_name}</p>
                    </Link>
                    <Link
                      href={`/dashboard/contacts/${encodeURIComponent(booking.guest_email)}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {booking.guest_email}
                    </Link>
                    <p className="mt-2 text-sm font-semibold text-foreground">
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

                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/bookings/${booking.id}`} className="btn-secondary min-h-[44px]">
                      View details
                    </Link>
                    <a
                      href={`/api/bookings/ics?token=${encodeURIComponent(booking.cancel_token)}`}
                      className="btn-secondary min-h-[44px] text-center"
                    >
                      Add to calendar
                    </a>
                    {tab === "upcoming" && (
                      <>
                        <button
                          type="button"
                          className="btn-secondary min-h-[44px]"
                          disabled={cancellingId === booking.id}
                          onClick={() =>
                            setPendingCancel({ id: booking.id, guestName: booking.guest_name })
                          }
                        >
                          {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                        </button>
                        <a
                          href={`/cancel/${booking.cancel_token}`}
                          className="text-center text-xs font-semibold text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Guest manage link
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title="Cancel this booking?"
        description={`The meeting with ${pendingCancel?.guestName ?? "this guest"} will be cancelled and removed from your calendar.`}
        confirmLabel="Cancel booking"
        variant="destructive"
        loading={Boolean(cancellingId)}
        onCancel={() => setPendingCancel(null)}
        onConfirm={() => {
          if (pendingCancel) {
            cancelBooking(pendingCancel.id);
          }
        }}
      />
    </>
  );
}

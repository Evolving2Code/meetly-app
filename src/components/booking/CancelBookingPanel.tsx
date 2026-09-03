"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateLabel, formatSlotLabel } from "@/lib/scheduling/format";

export function CancelBookingPanel({
  eventTitle,
  hostName,
  startTime,
  timezone,
  cancelToken,
}: {
  eventTitle: string;
  hostName: string;
  startTime: string;
  timezone: string;
  cancelToken: string;
}) {
  const router = useRouter();
  const [cancelled, setCancelled] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancelBooking() {
    setCancelling(true);
    setError(null);

    const response = await fetch(`/api/bookings?token=${encodeURIComponent(cancelToken)}`, {
      method: "DELETE",
    });

    setCancelling(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not cancel booking.");
      return;
    }

    setCancelled(true);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="card">
        {cancelled ? (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
              Cancelled
            </p>
            <h1 className="mt-2 text-2xl font-black text-navy">Booking cancelled</h1>
            <p className="mt-3 text-sm text-muted">
              Your meeting with {hostName} has been cancelled.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
              Manage booking
            </p>
            <h1 className="mt-2 text-2xl font-black text-navy">
              {eventTitle} with {hostName}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {formatDateLabel(new Date(startTime), timezone)} at{" "}
              {formatSlotLabel(new Date(startTime), timezone)} ({timezone})
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/reschedule/${cancelToken}`} className="btn-primary min-h-[44px]">
                Reschedule
              </Link>
              <a
                href={`/api/bookings/ics?token=${encodeURIComponent(cancelToken)}`}
                className="btn-secondary min-h-[44px]"
              >
                Add to calendar (.ics)
              </a>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="button"
              className="btn-secondary mt-6"
              disabled={cancelling}
              onClick={cancelBooking}
            >
              {cancelling ? "Cancelling..." : "Cancel booking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

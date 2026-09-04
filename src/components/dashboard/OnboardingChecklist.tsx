"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  complete: boolean;
};

type OnboardingChecklistProps = {
  hasAvailability: boolean;
  hasEventType: boolean;
  calendarConnected: boolean;
  hasBookingLink: boolean;
  hasBooking: boolean;
};

const DISMISS_KEY = "meetly-onboarding-dismissed";

export function OnboardingChecklist({
  hasAvailability,
  hasEventType,
  calendarConnected,
  hasBookingLink,
  hasBooking,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true);

  const items = useMemo<ChecklistItem[]>(
    () => [
      {
        id: "availability",
        label: "Set your availability",
        description: "Define when guests can book with you.",
        href: "/dashboard/availability",
        complete: hasAvailability,
      },
      {
        id: "event-type",
        label: "Create an event type",
        description: "Add duration, buffers, and booking limits.",
        href: "/dashboard/event-types",
        complete: hasEventType,
      },
      {
        id: "calendar",
        label: "Connect Google Calendar",
        description: "Block busy times and auto-create events.",
        href: "/dashboard/settings",
        complete: calendarConnected,
      },
      {
        id: "link",
        label: "Share your booking link",
        description: "Copy your link and send it to guests.",
        href: "/dashboard/event-types",
        complete: hasBookingLink,
      },
      {
        id: "booking",
        label: "Get your first booking",
        description: "Your calendar is ready — time to share it.",
        href: "/dashboard/bookings",
        complete: hasBooking,
      },
    ],
    [hasAvailability, hasEventType, calendarConnected, hasBookingLink, hasBooking],
  );

  const completedCount = items.filter((item) => item.complete).length;
  const allComplete = completedCount === items.length;

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  if (dismissed || allComplete) {
    return null;
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  }

  return (
    <section className="card mb-8 border-lime/30 bg-gradient-to-br from-lime/5 to-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark">
            Getting started
          </p>
          <h2 className="mt-1 text-xl font-black text-navy">Finish setting up Meetly</h2>
          <p className="mt-1 text-sm text-muted">
            {completedCount} of {items.length} steps complete
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-muted transition hover:text-navy"
          onClick={dismiss}
        >
          Dismiss
        </button>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-lime transition-all duration-500"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                item.complete
                  ? "border-lime/20 bg-lime/5"
                  : "border-border bg-background hover:border-lime/40 hover:bg-surface"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  item.complete ? "bg-lime text-navy" : "bg-surface text-muted"
                }`}
                aria-hidden
              >
                {item.complete ? "✓" : ""}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-navy">{item.label}</span>
                <span className="mt-0.5 block text-sm text-muted">{item.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useState } from "react";

type NotificationPreferencesState = {
  emailOnNewBooking: boolean;
  emailGuestConfirmation: boolean;
  emailBookingReminder: boolean;
  reminderHoursBefore: number;
};

const REMINDER_OPTIONS = [
  { value: 1, label: "1 hour before" },
  { value: 2, label: "2 hours before" },
  { value: 6, label: "6 hours before" },
  { value: 12, label: "12 hours before" },
  { value: 24, label: "24 hours before" },
  { value: 48, label: "48 hours before" },
];

export function NotificationPreferencesForm({
  initialPreferences,
}: {
  initialPreferences: NotificationPreferencesState;
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function savePreferences() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/notification-preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not save notification preferences.");
      return;
    }

    const saved = await response.json();
    setPreferences(saved);
    setMessage("Notification preferences saved.");
  }

  return (
    <section className="card">
      <h2 className="text-xl font-black">Notifications</h2>
      <p className="mt-2 text-sm text-muted">
        Choose which booking emails Meetly sends. Reminders are checked once per day when email
        delivery is configured.
      </p>

      <div className="mt-6 space-y-4">
        <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={preferences.emailOnNewBooking}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                emailOnNewBooking: event.target.checked,
              }))
            }
          />
          <span>
            <span className="block font-semibold text-navy">Email me when someone books</span>
            <span className="mt-1 block text-sm text-muted">
              Get a notification at your account email when a guest confirms a meeting.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={preferences.emailGuestConfirmation}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                emailGuestConfirmation: event.target.checked,
              }))
            }
          />
          <span>
            <span className="block font-semibold text-navy">Send guests a confirmation email</span>
            <span className="mt-1 block text-sm text-muted">
              Guests receive meeting details and a cancel link after booking.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={preferences.emailBookingReminder}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                emailBookingReminder: event.target.checked,
              }))
            }
          />
          <span>
            <span className="block font-semibold text-navy">Send booking reminders</span>
            <span className="mt-1 block text-sm text-muted">
              Remind you and your guests before upcoming meetings. On the free Vercel plan,
              reminders are sent during the daily check (not at the exact minute).
            </span>
          </span>
        </label>

        {preferences.emailBookingReminder && (
          <label className="block">
            <span className="label">Reminder timing</span>
            <select
              className="input"
              value={preferences.reminderHoursBefore}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  reminderHoursBefore: Number(event.target.value),
                }))
              }
            >
              {REMINDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <button type="button" className="btn-primary" disabled={loading} onClick={savePreferences}>
          {loading ? "Saving..." : "Save notifications"}
        </button>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        {message && <p className="text-sm font-medium text-lime-dark">{message}</p>}
      </div>
    </section>
  );
}

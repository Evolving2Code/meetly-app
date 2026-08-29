"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIMEZONES } from "@/lib/scheduling/constants";
import { ConnectGoogleCalendarButton } from "@/components/auth/ConnectGoogleCalendarButton";

type SettingsUser = {
  username: string | null;
  timezone: string;
  email: string;
  name: string | null;
} | null;

export function SettingsForm({
  user,
  calendarConnected,
  calendarStatus,
}: {
  user: SettingsUser;
  calendarConnected: boolean;
  calendarStatus?: string | null;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(user?.username ?? "");
  const [timezone, setTimezone] = useState(user?.timezone ?? "America/New_York");
  const [message, setMessage] = useState<string | null>(
    calendarStatus === "connected"
      ? "Google Calendar connected."
      : calendarStatus === "error"
        ? "Could not connect Google Calendar. Try again."
        : null,
  );
  const [loading, setLoading] = useState(false);

  async function saveProfile() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, timezone }),
    });

    setLoading(false);

    if (!response.ok) {
      setMessage("Could not save settings.");
      return;
    }

    setMessage("Settings saved.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="card">
        <h2 className="text-xl font-black">Profile</h2>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="label">Display name</span>
            <input className="input" value={user?.name ?? ""} disabled />
          </label>
          <label className="block">
            <span className="label">Email</span>
            <input className="input" value={user?.email ?? ""} disabled />
          </label>
          <label className="block">
            <span className="label">Booking page username</span>
            <input
              className="input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="label">Timezone</span>
            <select
              className="input"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            >
              {TIMEZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="btn-primary" disabled={loading} onClick={saveProfile}>
            {loading ? "Saving..." : "Save settings"}
          </button>
          {message && (
            <p
              className={`text-sm font-medium ${
                message.includes("Could not") ? "text-red-600" : "text-lime-dark"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-black">Google Calendar</h2>
        <p className="mt-2 text-sm text-muted">
          Connect Google Calendar to block busy times and create events when guests book.
          This is separate from signing in to Meetly.
        </p>

        <div className="mt-6 rounded-2xl bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-navy">Connection status</p>
              <p className="mt-1 text-sm text-muted">
                {calendarConnected
                  ? "Your Google Calendar is connected."
                  : "Not connected yet. You can still accept bookings without this."}
              </p>
            </div>
            <span className={calendarConnected ? "badge-lime" : "badge bg-slate-200 text-slate-600"}>
              {calendarConnected ? "Connected" : "Optional"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <ConnectGoogleCalendarButton connected={calendarConnected} />
        </div>

        <div className="mt-6 rounded-2xl border border-border p-5">
          <p className="text-sm font-semibold text-navy">What syncs</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Busy times are blocked from your booking availability</li>
            <li>New bookings create Google Calendar events with Meet links</li>
            <li>Cancellations remove the calendar event</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

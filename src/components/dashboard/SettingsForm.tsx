"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectGoogleCalendarButton } from "@/components/auth/ConnectGoogleCalendarButton";
import { ProfileAvatarEditor } from "@/components/dashboard/ProfileAvatarEditor";
import {
  detectBrowserTimezone,
  formatTimezoneLabel,
  getTimezoneOptions,
} from "@/lib/scheduling/timezones";
import { normalizeUsername } from "@/lib/validation/username";
import { BRAND_COLOR_PRESETS, DEFAULT_BRAND_COLOR, normalizeBrandColor } from "@/lib/branding/colors";

type SettingsUser = {
  username: string | null;
  timezone: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  brandColor: string | null;
} | null;

export function SettingsForm({
  user,
  siteUrl,
  calendarConnected,
  calendarStatus,
}: {
  user: SettingsUser;
  siteUrl: string;
  calendarConnected: boolean;
  calendarStatus?: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [timezone, setTimezone] = useState(user?.timezone ?? "America/New_York");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? null);
  const [brandColor, setBrandColor] = useState(user?.brandColor ?? DEFAULT_BRAND_COLOR);
  const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    calendarStatus === "connected"
      ? "Google Calendar connected."
      : calendarStatus === "error"
        ? "Could not connect Google Calendar. Try again."
        : null,
  );
  const [loading, setLoading] = useState(false);

  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);
  const normalizedUsername = normalizeUsername(username);
  const bookingPreviewPath = normalizedUsername
    ? `/book/${normalizedUsername}/your-event-slug`
    : "/book/your-username/your-event-slug";
  const bookingPreviewUrl = `${siteUrl.replace(/\/$/, "")}${bookingPreviewPath}`;

  useEffect(() => {
    setDetectedTimezone(detectBrowserTimezone());
  }, []);

  async function saveProfile() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, timezone, brand_color: brandColor }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error ?? "Could not save settings.");
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
          <ProfileAvatarEditor
            name={name || user?.email || "User"}
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
          />

          <label className="block">
            <span className="label">Display name</span>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
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
              placeholder="your-username"
            />
            <p className="mt-2 text-sm text-muted">
              Your public booking links look like{" "}
              <span className="font-medium text-navy">{bookingPreviewUrl}</span>
            </p>
          </label>

          <label className="block">
            <span className="label">Timezone</span>
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
            {detectedTimezone && detectedTimezone !== timezone && (
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-primary hover:underline"
                onClick={() => setTimezone(detectedTimezone)}
              >
                Use current timezone ({formatTimezoneLabel(detectedTimezone)})
              </button>
            )}
          </label>

          <div>
            <span className="label">Booking page brand color</span>
            <p className="mb-3 text-sm text-muted">
              Guests see this color on your booking page sidebar.
            </p>
            <div className="flex flex-wrap gap-2">
              {BRAND_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  aria-label={`Use brand color ${preset}`}
                  className={`h-10 w-10 rounded-full border-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    brandColor.toUpperCase() === preset ? "border-lime scale-105" : "border-transparent"
                  }`}
                  style={{ backgroundColor: preset }}
                  onClick={() => setBrandColor(preset)}
                />
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3">
              <input
                type="color"
                className="h-11 w-16 cursor-pointer rounded-xl border border-border bg-background"
                value={normalizeBrandColor(brandColor)}
                onChange={(event) => setBrandColor(event.target.value.toUpperCase())}
              />
              <input
                className="input max-w-[8rem] font-mono text-sm uppercase"
                value={brandColor}
                onChange={(event) => setBrandColor(event.target.value)}
                placeholder="#12385F"
              />
            </label>
          </div>

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
          Connect Google Calendar to block busy times and create events when guests book. This is
          separate from signing in to Meetly.
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

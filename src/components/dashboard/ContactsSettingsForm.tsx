"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ContactPreferences = {
  defaultSort: "recent" | "name" | "meetings";
  autoImportFromBookings: boolean;
};

export function ContactsSettingsForm() {
  const [preferences, setPreferences] = useState<ContactPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPreferences() {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/contact-preferences");
      setLoading(false);

      if (!response.ok) {
        setError("Could not load contacts settings.");
        return;
      }

      setPreferences(await response.json());
    }

    loadPreferences();
  }, []);

  async function savePreferences(updates: Partial<ContactPreferences>) {
    if (!preferences) {
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/contact-preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    setSaving(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Could not save settings.");
      return;
    }

    const data = await response.json();
    setPreferences(data);
    setMessage("Settings saved.");
  }

  if (loading) {
    return <div className="card text-center text-muted">Loading contacts settings...</div>;
  }

  if (!preferences) {
    return <div className="card text-center text-red-600">{error ?? "Could not load settings."}</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/contacts" className="text-sm font-semibold text-primary hover:underline">
        ← Back to contacts
      </Link>

      <div className="card max-w-2xl">
        <h1 className="text-2xl font-black text-navy">Contacts settings</h1>
        <p className="mt-2 text-sm text-muted">
          Control how contacts are imported, sorted, and displayed in your dashboard.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="label" htmlFor="default-sort">
              Default sort order
            </label>
            <select
              id="default-sort"
              className="input"
              value={preferences.defaultSort}
              disabled={saving}
              onChange={(event) =>
                savePreferences({
                  defaultSort: event.target.value as ContactPreferences["defaultSort"],
                })
              }
            >
              <option value="recent">Most recent</option>
              <option value="name">Name (A–Z)</option>
              <option value="meetings">Most meetings</option>
            </select>
            <p className="mt-2 text-sm text-muted">
              Used when you first open the contacts page.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={preferences.autoImportFromBookings}
              disabled={saving}
              onChange={(event) =>
                savePreferences({ autoImportFromBookings: event.target.checked })
              }
            />
            <span>
              <span className="block font-semibold text-navy">Automatically add guests from bookings</span>
              <span className="mt-1 block text-sm text-muted">
                When enabled, anyone who books with you is added to contacts automatically.
              </span>
            </span>
          </label>
        </div>

        {message && <p className="mt-4 text-sm font-medium text-lime-dark">{message}</p>}
        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      </div>
    </div>
  );
}

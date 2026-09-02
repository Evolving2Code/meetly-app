"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import type { DateOverride } from "@/lib/supabase/types";

type OverrideRow = {
  id: string;
  date: string;
  available: boolean;
  startTime: string | null;
  endTime: string | null;
};

const emptyForm = {
  date: "",
  available: true,
  startTime: "09:00",
  endTime: "17:00",
};

export function DateOverridesEditor({
  initialOverrides,
}: {
  initialOverrides: DateOverride[];
}) {
  const [overrides, setOverrides] = useState<OverrideRow[]>(
    initialOverrides.map((override) => ({
      id: override.id,
      date: override.date,
      available: override.available,
      startTime: override.start_time,
      endTime: override.end_time,
    })),
  );
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function saveOverride() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/date-overrides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not save date override.");
      return;
    }

    const saved = await response.json();
    setOverrides((current) => {
      const withoutDate = current.filter((item) => item.date !== saved.date);
      return [...withoutDate, saved].sort((a, b) => a.date.localeCompare(b.date));
    });
    setForm(emptyForm);
    setMessage("Date override saved.");
  }

  async function removeOverride(date: string) {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/date-overrides?date=${encodeURIComponent(date)}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not remove date override.");
      return;
    }

    setOverrides((current) => current.filter((item) => item.date !== date));
    setMessage("Date override removed.");
  }

  return (
    <div className="card max-w-4xl">
      <h2 className="text-xl font-black">Date-specific hours</h2>
      <p className="mt-2 text-sm text-muted">
        Override your weekly schedule for specific dates. Block a day off or set custom hours.
      </p>

      <div className="mt-6 space-y-3">
        {overrides.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-sm text-muted">
            No date overrides yet. Your weekly hours apply to every day.
          </p>
        ) : (
          overrides.map((override) => (
            <div
              key={override.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div>
                <p className="font-bold text-navy">
                  {format(parseISO(override.date), "EEEE, MMMM d, yyyy")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {override.available && override.startTime && override.endTime
                    ? `${override.startTime} to ${override.endTime}`
                    : "Unavailable"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={
                    override.available && override.startTime
                      ? "badge-lime"
                      : "badge bg-slate-200 text-slate-600"
                  }
                >
                  {override.available && override.startTime ? "Custom hours" : "Blocked"}
                </span>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-600 hover:underline"
                  disabled={loading}
                  onClick={() => removeOverride(override.date)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border p-4 sm:p-5">
        <h3 className="text-lg font-black text-navy">Add date override</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="label">Date</span>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="label">Status</span>
            <select
              className="input"
              value={form.available ? "available" : "blocked"}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  available: event.target.value === "available",
                }))
              }
            >
              <option value="available">Custom hours</option>
              <option value="blocked">Unavailable</option>
            </select>
          </label>

          {form.available && (
            <>
              <label className="block">
                <span className="label">Start time</span>
                <input
                  className="input"
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startTime: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="label">End time</span>
                <input
                  className="input"
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endTime: event.target.value }))
                  }
                />
              </label>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-primary mt-4"
          disabled={loading || !form.date}
          onClick={saveOverride}
        >
          {loading ? "Saving..." : "Save override"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      {message && <p className="mt-4 text-sm font-medium text-lime-dark">{message}</p>}
    </div>
  );
}

"use client";

import type { EventType } from "@/lib/supabase/types";

export type EventTypeFormValues = {
  title: string;
  slug: string;
  description: string;
  duration: number;
  bufferBefore: number;
  bufferAfter: number;
  minNotice: number;
  maxDaysAhead: number;
  location: string;
};

export const emptyEventTypeForm: EventTypeFormValues = {
  title: "",
  slug: "",
  description: "",
  duration: 30,
  bufferBefore: 0,
  bufferAfter: 15,
  minNotice: 120,
  maxDaysAhead: 60,
  location: "Google Meet",
};

export function eventTypeToFormValues(eventType: EventType): EventTypeFormValues {
  return {
    title: eventType.title,
    slug: eventType.slug,
    description: eventType.description ?? "",
    duration: eventType.duration,
    bufferBefore: eventType.buffer_before,
    bufferAfter: eventType.buffer_after,
    minNotice: eventType.min_notice,
    maxDaysAhead: eventType.max_days_ahead,
    location: eventType.location ?? "",
  };
}

export function EventTypeForm({
  form,
  setForm,
  submitLabel,
  loading,
  disabled,
  onSubmit,
  message,
  error,
  slugWarning,
}: {
  form: EventTypeFormValues;
  setForm: React.Dispatch<React.SetStateAction<EventTypeFormValues>>;
  submitLabel: string;
  loading: boolean;
  disabled?: boolean;
  onSubmit: () => void;
  message?: string | null;
  error?: string | null;
  slugWarning?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Field label="Title">
        <input
          className="input"
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              title: event.target.value,
              slug:
                current.slug ||
                event.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, ""),
            }))
          }
        />
      </Field>

      <Field label="URL slug">
        <input
          className="input"
          value={form.slug}
          onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
        />
        {slugWarning && (
          <p className="mt-2 text-xs text-amber-700">
            Changing the slug will break existing shared links for this event type.
          </p>
        )}
      </Field>

      <Field label="Description">
        <textarea
          className="input min-h-24"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Duration (minutes)">
          <input
            className="input"
            type="number"
            value={form.duration}
            onChange={(event) =>
              setForm((current) => ({ ...current, duration: Number(event.target.value) }))
            }
          />
        </Field>
        <Field label="Location">
          <input
            className="input"
            value={form.location}
            onChange={(event) =>
              setForm((current) => ({ ...current, location: event.target.value }))
            }
          />
        </Field>
        <Field label="Buffer before (minutes)">
          <input
            className="input"
            type="number"
            value={form.bufferBefore}
            onChange={(event) =>
              setForm((current) => ({ ...current, bufferBefore: Number(event.target.value) }))
            }
          />
        </Field>
        <Field label="Buffer after (minutes)">
          <input
            className="input"
            type="number"
            value={form.bufferAfter}
            onChange={(event) =>
              setForm((current) => ({ ...current, bufferAfter: Number(event.target.value) }))
            }
          />
        </Field>
        <Field label="Minimum notice (minutes)">
          <input
            className="input"
            type="number"
            value={form.minNotice}
            onChange={(event) =>
              setForm((current) => ({ ...current, minNotice: Number(event.target.value) }))
            }
          />
        </Field>
        <Field label="Max days ahead">
          <input
            className="input"
            type="number"
            value={form.maxDaysAhead}
            onChange={(event) =>
              setForm((current) => ({ ...current, maxDaysAhead: Number(event.target.value) }))
            }
          />
        </Field>
      </div>

      <button
        type="button"
        className="btn-primary w-full"
        disabled={loading || disabled || !form.title || !form.slug}
        onClick={onSubmit}
      >
        {loading ? "Saving..." : submitLabel}
      </button>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      {message && <p className="text-sm font-medium text-lime-dark">{message}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

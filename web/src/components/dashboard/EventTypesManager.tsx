"use client";

import { useState } from "react";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";
import type { EventType } from "@/lib/supabase/types";

const emptyForm = {
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

export function EventTypesManager({
  initialEventTypes,
  username,
}: {
  initialEventTypes: EventType[];
  username: string | null;
}) {
  const [eventTypes, setEventTypes] = useState(initialEventTypes);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function createEventType() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/event-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!response.ok) {
      setMessage("Could not create event type.");
      return;
    }

    const created = await response.json();
    setEventTypes((current) => [...current, created]);
    setForm(emptyForm);
    setMessage("Event type created.");
  }

  async function toggleActive(eventType: EventType) {
    const response = await fetch(`/api/event-types/${eventType.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !eventType.active }),
    });

    if (!response.ok) {
      return;
    }

    const updated = await response.json();
    setEventTypes((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="card">
        <h2 className="text-xl font-black">Your event types</h2>
        <div className="mt-6 space-y-4">
          {eventTypes.map((eventType) => (
            <div
              key={eventType.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-navy">{eventType.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {eventType.duration} min · {eventType.buffer_after} min buffer ·{" "}
                    {eventType.min_notice} min notice
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleActive(eventType)}
                  className={eventType.active ? "badge-lime" : "badge bg-slate-200 text-slate-600"}
                >
                  {eventType.active ? "Active" : "Inactive"}
                </button>
              </div>

              {username && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-sm text-muted">
                    /book/{username}/{eventType.slug}
                  </p>
                  <CopyLinkButton
                    path={`/book/${username}/${eventType.slug}`}
                    label="Copy link"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-black">Create event type</h2>
        <div className="mt-6 space-y-4">
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
              onChange={(event) =>
                setForm((current) => ({ ...current, slug: event.target.value }))
              }
            />
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
                  setForm((current) => ({
                    ...current,
                    duration: Number(event.target.value),
                  }))
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
            <Field label="Buffer after (minutes)">
              <input
                className="input"
                type="number"
                value={form.bufferAfter}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    bufferAfter: Number(event.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Minimum notice (minutes)">
              <input
                className="input"
                type="number"
                value={form.minNotice}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    minNotice: Number(event.target.value),
                  }))
                }
              />
            </Field>
          </div>

          <button
            type="button"
            className="btn-primary w-full"
            disabled={loading || !form.title || !form.slug}
            onClick={createEventType}
          >
            {loading ? "Creating..." : "Create event type"}
          </button>

          {message && <p className="text-sm font-medium text-lime-dark">{message}</p>}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

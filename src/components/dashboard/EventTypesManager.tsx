"use client";

import { useState } from "react";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";
import {
  emptyEventTypeForm,
  EventTypeForm,
  eventTypeToFormValues,
} from "@/components/dashboard/EventTypeForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, EventTypeEmptyIcon } from "@/components/ui/EmptyState";
import type { EventType } from "@/lib/supabase/types";

export function EventTypesManager({
  initialEventTypes,
  username,
}: {
  initialEventTypes: EventType[];
  username: string | null;
}) {
  const [eventTypes, setEventTypes] = useState(initialEventTypes);
  const [createForm, setCreateForm] = useState(emptyEventTypeForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyEventTypeForm);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventType | null>(null);

  async function createEventType() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/event-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Could not create event type.");
      return;
    }

    const created = await response.json();
    setEventTypes((current) => [...current, created]);
    setCreateForm(emptyEventTypeForm);
    setMessage("Event type created.");
  }

  function startEditing(eventType: EventType) {
    setEditingId(eventType.id);
    setEditForm(eventTypeToFormValues(eventType));
    setOriginalSlug(eventType.slug);
    setMessage(null);
    setError(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setOriginalSlug(null);
    setEditForm(emptyEventTypeForm);
  }

  async function saveEventType() {
    if (!editingId) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/event-types/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Could not save event type.");
      return;
    }

    const updated = await response.json();
    setEventTypes((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
    setEditingId(null);
    setOriginalSlug(null);
    setMessage("Event type updated.");
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

  async function deleteEventType(eventType: EventType) {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/event-types/${eventType.id}`, {
      method: "DELETE",
    });

    setLoading(false);
    setPendingDelete(null);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not delete event type.");
      return;
    }

    setEventTypes((current) => current.filter((item) => item.id !== eventType.id));
    if (editingId === eventType.id) {
      cancelEditing();
    }
    setMessage("Event type deleted.");
  }

  return (
    <>
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="card">
        <h2 className="text-xl font-black">Your event types</h2>
        <div className="mt-6 space-y-4">
          {eventTypes.length === 0 ? (
            <EmptyState
              icon={<EventTypeEmptyIcon />}
              title="No event types yet"
              description="Create your first booking link so guests can schedule time with you."
            />
          ) : null}
          {eventTypes.map((eventType) => (
            <div
              key={eventType.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              {editingId === eventType.id ? (
                <div>
                  <h3 className="mb-4 text-lg font-black text-navy">Edit event type</h3>
                  <EventTypeForm
                    form={editForm}
                    setForm={setEditForm}
                    submitLabel="Save changes"
                    loading={loading}
                    onSubmit={saveEventType}
                    error={error}
                    slugWarning={originalSlug !== null && editForm.slug !== originalSlug}
                  />
                  <button
                    type="button"
                    className="mt-4 text-sm font-semibold text-muted hover:underline"
                    onClick={cancelEditing}
                  >
                    Cancel editing
                  </button>
                </div>
              ) : (
                <>
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
                      className={
                        eventType.active ? "badge-lime" : "badge bg-slate-200 text-slate-600"
                      }
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

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn-secondary min-h-[44px]"
                      onClick={() => startEditing(eventType)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-600 hover:underline"
                      onClick={() => setPendingDelete(eventType)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-black">Create event type</h2>
        <div className="mt-6">
          <EventTypeForm
            form={createForm}
            setForm={setCreateForm}
            submitLabel="Create event type"
            loading={loading}
            onSubmit={createEventType}
            message={message}
            error={editingId ? null : error}
          />
        </div>
      </section>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.title ?? "event type"}"?`}
        description="This cannot be undone. Event types with existing bookings cannot be deleted."
        confirmLabel="Delete event type"
        variant="destructive"
        loading={loading}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteEventType(pendingDelete);
          }
        }}
      />
    </>
  );
}

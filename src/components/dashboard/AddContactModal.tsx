"use client";

import { useState } from "react";

type AddContactModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function AddContactModal({ open, onClose, onCreated }: AddContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, notes }),
    });

    setSaving(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Could not add contact.");
      return;
    }

    setName("");
    setEmail("");
    setNotes("");
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close add contact dialog"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-navy">Add contact</h2>
            <p className="mt-1 text-sm text-muted">
              Save someone you want to remember, even before they book.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-full px-3 text-sm font-semibold text-muted hover:bg-surface"
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@example.com"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="contact-notes">
              Notes (optional)
            </label>
            <textarea
              id="contact-notes"
              className="input min-h-[100px] resize-y"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="How you know them, preferences, follow-ups..."
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" className="btn-secondary min-h-[44px]" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary min-h-[44px]" disabled={saving}>
              {saving ? "Adding..." : "Add contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type ContactBooking = {
  id: string;
  guestName: string;
  guestEmail: string;
  guestNotes: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  eventTitle: string;
};

type ContactDetailData = {
  contact: {
    email: string;
    name: string;
    bookingCount: number;
    firstMeeting: string;
    lastMeeting: string;
    upcomingCount: number;
    notes: string | null;
    isManual?: boolean;
  };
  bookings: ContactBooking[];
};

export function ContactDetail({ email }: { email: string }) {
  const router = useRouter();
  const [data, setData] = useState<ContactDetailData | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadContact() {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/contacts/${encodeURIComponent(email)}`);
      setLoading(false);

      if (!response.ok) {
        setError(response.status === 404 ? "Contact not found." : "Could not load contact.");
        return;
      }

      const payload = (await response.json()) as ContactDetailData;
      setData(payload);
      setNotes(payload.contact.notes ?? "");
    }

    loadContact();
  }, [email]);

  async function saveNotes() {
    if (!data) {
      return;
    }

    setSaving(true);
    setSaveMessage(null);
    setError(null);

    const response = await fetch(`/api/contacts/${encodeURIComponent(email)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });

    setSaving(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Could not save notes.");
      return;
    }

    const payload = await response.json();
    setData((current) =>
      current
        ? {
            ...current,
            contact: { ...current.contact, notes: payload.notes },
          }
        : current,
    );
    setSaveMessage("Notes saved.");
  }

  async function deleteContact() {
    if (!data || data.bookings.length > 0) {
      return;
    }

    setDeleting(true);
    setError(null);

    const response = await fetch(`/api/contacts/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });

    setDeleting(false);
    setShowDeleteDialog(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Could not delete contact.");
      return;
    }

    router.push("/dashboard/contacts");
    router.refresh();
  }

  if (loading) {
    return <div className="card text-center text-muted">Loading contact...</div>;
  }

  if (error && !data) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/contacts" className="text-sm font-semibold text-primary hover:underline">
          ← Back to contacts
        </Link>
        <div className="card text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { contact, bookings } = data;
  const upcoming = bookings.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.startTime) >= new Date(),
  );
  const past = bookings.filter(
    (booking) => booking.status !== "confirmed" || new Date(booking.startTime) < new Date(),
  );

  return (
    <div className="space-y-6">
      <Link href="/dashboard/contacts" className="text-sm font-semibold text-primary hover:underline">
        ← Back to contacts
      </Link>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy sm:text-3xl">{contact.name}</h1>
            <a
              href={`mailto:${contact.email}`}
              className="mt-2 block text-sm font-semibold text-primary hover:underline"
            >
              {contact.email}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Total meetings" value={String(contact.bookingCount)} />
            <Stat label="Upcoming" value={String(contact.upcomingCount)} />
            <Stat
              label={contact.bookingCount > 0 ? "First met" : "Added"}
              value={format(new Date(contact.firstMeeting), "MMM d, yyyy")}
            />
            <Stat
              label={contact.bookingCount > 0 ? "Last met" : "Last updated"}
              value={format(new Date(contact.lastMeeting), "MMM d, yyyy")}
            />
          </div>
        </div>
        {contact.isManual && bookings.length === 0 && (
          <button
            type="button"
            className="btn-secondary min-h-[44px] text-red-600"
            disabled={deleting}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete contact
          </button>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete contact?"
        description={`${contact.name} will be removed from your contacts. This cannot be undone.`}
        confirmLabel="Delete contact"
        variant="destructive"
        loading={deleting}
        onConfirm={deleteContact}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <div className="card">
        <h2 className="text-lg font-black text-navy">Private notes</h2>
        <p className="mt-1 text-sm text-muted">Only you can see these notes about this contact.</p>
        <textarea
          className="input mt-4 min-h-[120px] resize-y"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add context, preferences, or follow-up items..."
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-primary min-h-[44px]"
            disabled={saving}
            onClick={saveNotes}
          >
            {saving ? "Saving..." : "Save notes"}
          </button>
          {saveMessage && <p className="text-sm font-medium text-lime-dark">{saveMessage}</p>}
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </div>
      </div>

      {upcoming.length > 0 && (
        <section className="card">
          <h2 className="mb-4 text-lg font-black text-navy">Upcoming meetings</h2>
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="mb-4 text-lg font-black text-navy">Meeting history</h2>
        {past.length === 0 ? (
          <p className="text-sm text-muted">
            {bookings.length === 0
              ? "No meetings yet. This contact was added manually."
              : "No past meetings yet."}
          </p>
        ) : (
          <div className="space-y-3">
            {past.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-bold text-navy">{value}</p>
    </div>
  );
}

function BookingRow({ booking }: { booking: ContactBooking }) {
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-navy">{booking.eventTitle}</p>
          <p className="mt-1 text-sm text-muted">
            {format(new Date(booking.startTime), "EEE, MMM d, yyyy")} ·{" "}
            {format(new Date(booking.startTime), "h:mm a")} –{" "}
            {format(new Date(booking.endTime), "h:mm a")}
          </p>
          {booking.guestNotes && (
            <p className="mt-2 text-sm text-muted">Guest notes: {booking.guestNotes}</p>
          )}
        </div>
        <span
          className={`badge ${isCancelled ? "bg-red-50 text-red-700" : "badge-lime"}`}
        >
          {isCancelled ? "Cancelled" : "Confirmed"}
        </span>
      </div>
    </div>
  );
}

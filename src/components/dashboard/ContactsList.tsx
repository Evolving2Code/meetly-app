"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

type Contact = {
  name: string;
  email: string;
  bookingCount: number;
  lastMeeting: string;
};

export function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContacts() {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/contacts");
      setLoading(false);

      if (!response.ok) {
        setError("Could not load contacts.");
        return;
      }

      const data = await response.json();
      setContacts(data);
    }

    loadContacts();
  }, []);

  if (loading) {
    return <div className="card text-center text-muted">Loading contacts...</div>;
  }

  if (error) {
    return <div className="card text-center text-red-600">{error}</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="card text-center">
        <p className="font-semibold text-navy">No contacts yet</p>
        <p className="mt-2 text-sm text-muted">
          Guests who book through your links will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.email}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-4 py-4"
          >
            <div>
              <p className="font-bold text-navy">{contact.name}</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1 block text-sm text-primary hover:underline"
              >
                {contact.email}
              </a>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold text-navy">
                {contact.bookingCount} booking{contact.bookingCount === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-muted">
                Last met {format(new Date(contact.lastMeeting), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

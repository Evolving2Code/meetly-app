"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { contactsToCsv } from "@/lib/contacts/aggregate";
import { AddContactModal } from "./AddContactModal";

type Contact = {
  name: string;
  email: string;
  bookingCount: number;
  firstMeeting: string;
  lastMeeting: string;
  upcomingCount: number;
  notes: string | null;
  isManual?: boolean;
};

type SortOption = "recent" | "name" | "meetings";

export function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadPreferences() {
      const response = await fetch("/api/contact-preferences");
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setSort(data.defaultSort ?? "recent");
    }

    loadPreferences();
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ sort });
    if (search.trim()) {
      params.set("search", search.trim());
    }

    const response = await fetch(`/api/contacts?${params.toString()}`);
    setLoading(false);

    if (!response.ok) {
      setError("Could not load contacts.");
      return;
    }

    const data = await response.json();
    setContacts(data);
  }, [search, sort]);

  useEffect(() => {
    const timeout = setTimeout(loadContacts, search ? 250 : 0);
    return () => clearTimeout(timeout);
  }, [loadContacts, search, refreshKey]);

  const stats = useMemo(() => {
    return {
      total: contacts.length,
      upcoming: contacts.reduce((sum, contact) => sum + contact.upcomingCount, 0),
      repeatGuests: contacts.filter((contact) => contact.bookingCount > 1).length,
    };
  }, [contacts]);

  function exportCsv() {
    const blob = new Blob([contactsToCsv(contacts)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `meetly-contacts-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Contacts" value={stats.total} />
        <StatCard label="Upcoming meetings" value={stats.upcoming} />
        <StatCard label="Repeat guests" value={stats.repeatGuests} />
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            className="input min-h-[44px] flex-1"
            placeholder="Search by name, email, or notes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="input min-h-[44px]"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            <option value="recent">Most recent</option>
            <option value="name">Name (A–Z)</option>
            <option value="meetings">Most meetings</option>
          </select>
          <button
            type="button"
            className="btn-primary min-h-[44px]"
            onClick={() => setShowAddModal(true)}
          >
            Add contact
          </button>
          <button
            type="button"
            className="btn-secondary min-h-[44px]"
            disabled={contacts.length === 0}
            onClick={exportCsv}
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card text-center text-muted">Loading contacts...</div>
      ) : error ? (
        <div className="card text-center text-red-600">{error}</div>
      ) : contacts.length === 0 ? (
        <div className="card text-center">
          <p className="font-semibold text-navy">
            {search ? "No contacts match your search" : "No contacts yet"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {search
              ? "Try a different name, email, or note keyword."
              : "Guests who book through your links will appear here automatically, or add someone manually."}
          </p>
          {!search && (
            <button
              type="button"
              className="btn-primary mt-4 min-h-[44px]"
              onClick={() => setShowAddModal(true)}
            >
              Add your first contact
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="space-y-3">
            {contacts.map((contact) => (
              <Link
                key={contact.email}
                href={`/dashboard/contacts/${encodeURIComponent(contact.email)}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-4 py-4 transition hover:border-primary/30 hover:bg-primary-light/20"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-navy">{contact.name}</p>
                    {contact.isManual && contact.bookingCount === 0 && (
                      <span className="badge bg-primary-light text-primary-dark">Manual</span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">{contact.email}</p>
                  {contact.notes && (
                    <p className="mt-2 line-clamp-1 text-sm text-muted">{contact.notes}</p>
                  )}
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-navy">
                    {contact.bookingCount} meeting{contact.bookingCount === 1 ? "" : "s"}
                  </p>
                  {contact.upcomingCount > 0 && (
                    <p className="mt-1 font-medium text-lime-dark">
                      {contact.upcomingCount} upcoming
                    </p>
                  )}
                  <p className="mt-1 text-muted">
                    {contact.bookingCount > 0
                      ? `Last met ${format(new Date(contact.lastMeeting), "MMM d, yyyy")}`
                      : `Added ${format(new Date(contact.lastMeeting), "MMM d, yyyy")}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <AddContactModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={() => setRefreshKey((current) => current + 1)}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-navy">{value}</p>
    </div>
  );
}

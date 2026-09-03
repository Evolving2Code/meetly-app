export type ContactBookingRow = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_notes: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  event_types: { title: string } | { title: string }[] | null;
};

export type ContactSummary = {
  email: string;
  name: string;
  bookingCount: number;
  firstMeeting: string;
  lastMeeting: string;
  upcomingCount: number;
  notes: string | null;
};

function normalizeEventType(
  eventTypes: ContactBookingRow["event_types"],
): { title: string } | null {
  if (!eventTypes) {
    return null;
  }

  return Array.isArray(eventTypes) ? (eventTypes[0] ?? null) : eventTypes;
}

export function buildContactSummaries(
  bookings: ContactBookingRow[],
  notesByEmail: Record<string, string | null>,
  now = new Date(),
): ContactSummary[] {
  const contactsMap = new Map<
    string,
    Omit<ContactSummary, "email" | "notes"> & { email: string }
  >();

  for (const booking of bookings) {
    const emailKey = booking.guest_email.toLowerCase();
    const existing = contactsMap.get(emailKey);
    const startTime = booking.start_time;
    const isUpcoming = new Date(startTime) >= now && booking.status === "confirmed";

    if (!existing) {
      contactsMap.set(emailKey, {
        email: booking.guest_email,
        name: booking.guest_name,
        bookingCount: 1,
        firstMeeting: startTime,
        lastMeeting: startTime,
        upcomingCount: isUpcoming ? 1 : 0,
      });
      continue;
    }

    existing.bookingCount += 1;
    if (isUpcoming) {
      existing.upcomingCount += 1;
    }

    if (new Date(startTime) < new Date(existing.firstMeeting)) {
      existing.firstMeeting = startTime;
    }

    if (new Date(startTime) > new Date(existing.lastMeeting)) {
      existing.lastMeeting = startTime;
      existing.name = booking.guest_name;
    }
  }

  return [...contactsMap.values()]
    .map((contact) => ({
      ...contact,
      notes: notesByEmail[contact.email.toLowerCase()] ?? null,
    }))
    .sort((a, b) => new Date(b.lastMeeting).getTime() - new Date(a.lastMeeting).getTime());
}

export function filterContacts(contacts: ContactSummary[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return contacts;
  }

  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(normalized) ||
      contact.email.toLowerCase().includes(normalized) ||
      (contact.notes ?? "").toLowerCase().includes(normalized),
  );
}

export function sortContacts(
  contacts: ContactSummary[],
  sort: "recent" | "name" | "meetings",
) {
  const sorted = [...contacts];

  if (sort === "name") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "meetings") {
    return sorted.sort((a, b) => b.bookingCount - a.bookingCount);
  }

  return sorted.sort(
    (a, b) => new Date(b.lastMeeting).getTime() - new Date(a.lastMeeting).getTime(),
  );
}

export function formatContactBooking(booking: ContactBookingRow) {
  return {
    id: booking.id,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    guestNotes: booking.guest_notes,
    startTime: booking.start_time,
    endTime: booking.end_time,
    timezone: booking.timezone,
    status: booking.status,
    eventTitle: normalizeEventType(booking.event_types)?.title ?? "Meeting",
  };
}

export function contactsToCsv(contacts: ContactSummary[]) {
  const header = "Name,Email,Total Meetings,Upcoming,First Meeting,Last Meeting,Notes";
  const rows = contacts.map((contact) =>
    [
      csvEscape(contact.name),
      csvEscape(contact.email),
      contact.bookingCount,
      contact.upcomingCount,
      contact.firstMeeting,
      contact.lastMeeting,
      csvEscape(contact.notes ?? ""),
    ].join(","),
  );

  return [header, ...rows].join("\n");
}

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

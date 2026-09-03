import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContactSummaries,
  contactsToCsv,
  filterContacts,
  formatContactBooking,
  sortContacts,
  type ContactBookingRow,
} from "./aggregate";

const bookings: ContactBookingRow[] = [
  {
    id: "1",
    guest_name: "Jane Doe",
    guest_email: "jane@example.com",
    guest_notes: "Prefers mornings",
    start_time: "2026-09-01T10:00:00.000Z",
    end_time: "2026-09-01T10:30:00.000Z",
    timezone: "America/New_York",
    status: "confirmed",
    event_types: { title: "Intro Call" },
  },
  {
    id: "2",
    guest_name: "Jane Doe",
    guest_email: "jane@example.com",
    guest_notes: null,
    start_time: "2026-09-15T14:00:00.000Z",
    end_time: "2026-09-15T14:30:00.000Z",
    timezone: "America/New_York",
    status: "confirmed",
    event_types: { title: "Follow-up" },
  },
  {
    id: "3",
    guest_name: "Alex Smith",
    guest_email: "alex@example.com",
    guest_notes: null,
    start_time: "2026-08-20T16:00:00.000Z",
    end_time: "2026-08-20T16:30:00.000Z",
    timezone: "America/New_York",
    status: "confirmed",
    event_types: [{ title: "Consultation" }],
  },
];

test("buildContactSummaries aggregates guests and upcoming counts", () => {
  const now = new Date("2026-09-10T00:00:00.000Z");
  const contacts = buildContactSummaries(
    bookings,
    { "jane@example.com": "VIP client" },
    now,
  );

  assert.equal(contacts.length, 2);

  const jane = contacts.find((contact) => contact.email === "jane@example.com");
  assert.ok(jane);
  assert.equal(jane.bookingCount, 2);
  assert.equal(jane.upcomingCount, 1);
  assert.equal(jane.notes, "VIP client");
  assert.equal(jane.firstMeeting, "2026-09-01T10:00:00.000Z");
  assert.equal(jane.lastMeeting, "2026-09-15T14:00:00.000Z");
});

test("filterContacts matches name, email, and notes", () => {
  const contacts = buildContactSummaries(bookings, { "jane@example.com": "VIP client" });

  assert.equal(filterContacts(contacts, "alex").length, 1);
  assert.equal(filterContacts(contacts, "VIP").length, 1);
  assert.equal(filterContacts(contacts, "jane@example.com").length, 1);
});

test("sortContacts supports name and meetings ordering", () => {
  const contacts = buildContactSummaries(bookings, {});

  const byName = sortContacts(contacts, "name");
  assert.equal(byName[0]?.email, "alex@example.com");

  const byMeetings = sortContacts(contacts, "meetings");
  assert.equal(byMeetings[0]?.email, "jane@example.com");
});

test("formatContactBooking normalizes event type title", () => {
  const formatted = formatContactBooking(bookings[2]!);

  assert.equal(formatted.eventTitle, "Consultation");
  assert.equal(formatted.guestEmail, "alex@example.com");
});

test("contactsToCsv escapes commas and quotes", () => {
  const contacts = buildContactSummaries(bookings, {
    "jane@example.com": 'VIP, "priority"',
  });
  const csv = contactsToCsv(contacts);

  assert.match(csv, /"VIP, ""priority"""/);
  assert.match(csv, /^Name,Email,Total Meetings,Upcoming,First Meeting,Last Meeting,Notes/m);
});

import assert from "node:assert/strict";
import test from "node:test";
import { buildIcsCalendarEvent } from "./ics";

test("buildIcsCalendarEvent includes core calendar fields", () => {
  const ics = buildIcsCalendarEvent({
    uid: "booking-123@meetly",
    title: "Intro Call with Jane",
    description: "Booked via Meetly",
    startTime: new Date("2025-10-29T19:00:00.000Z"),
    endTime: new Date("2025-10-29T19:30:00.000Z"),
    timezone: "America/New_York",
    attendeeEmail: "jane@example.com",
    attendeeName: "Jane Doe",
    organizerEmail: "host@example.com",
    organizerName: "Host",
  });

  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /SUMMARY:Intro Call with Jane/);
  assert.match(ics, /ATTENDEE;CN=Jane Doe/);
});

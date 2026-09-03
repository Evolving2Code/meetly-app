import assert from "node:assert/strict";
import test from "node:test";
import { mergeCalendarEvents } from "./merge-events";

test("mergeCalendarEvents deduplicates linked Google events", () => {
  const events = mergeCalendarEvents(
    [
      {
        id: "booking-1",
        guest_name: "Jane Doe",
        guest_email: "jane@example.com",
        start_time: "2026-09-10T15:00:00.000Z",
        end_time: "2026-09-10T15:30:00.000Z",
        google_event_id: "google-event-1",
        event_types: { title: "30 Minute Meeting" },
      },
    ],
    [
      {
        id: "google-event-1",
        title: "30 Minute Meeting with Jane Doe",
        start: "2026-09-10T15:00:00.000Z",
        end: "2026-09-10T15:30:00.000Z",
        location: null,
        htmlLink: "https://calendar.google.com/event-1",
      },
      {
        id: "google-event-2",
        title: "Team sync",
        start: "2026-09-10T17:00:00.000Z",
        end: "2026-09-10T18:00:00.000Z",
        location: null,
        htmlLink: null,
      },
    ],
  );

  assert.equal(events.length, 2);
  assert.equal(events[0]?.source, "meetly");
  assert.equal(events[1]?.source, "google");
  assert.equal(events[1]?.title, "Team sync");
});

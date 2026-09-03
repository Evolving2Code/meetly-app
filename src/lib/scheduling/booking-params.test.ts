import assert from "node:assert/strict";
import test from "node:test";
import { findSlotByDateAndTime, parseBookingDateParam, parseBookingTimeParam } from "./booking-params";

test("parseBookingDateParam accepts yyyy-MM-dd", () => {
  assert.equal(parseBookingDateParam("2025-10-29"), "2025-10-29");
  assert.equal(parseBookingDateParam("invalid"), undefined);
});

test("parseBookingTimeParam accepts HH:mm", () => {
  assert.equal(parseBookingTimeParam("15:00"), "15:00");
  assert.equal(parseBookingTimeParam("3:00"), undefined);
});

test("findSlotByDateAndTime matches guest-local time", () => {
  const slot = findSlotByDateAndTime(
    {
      "2025-10-29": [
        {
          start: "2025-10-29T19:00:00.000Z",
          end: "2025-10-29T19:30:00.000Z",
        },
      ],
    },
    "2025-10-29",
    "15:00",
    "America/New_York",
  );

  assert.ok(slot);
  assert.equal(slot.start, "2025-10-29T19:00:00.000Z");
});

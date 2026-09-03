import assert from "node:assert/strict";
import test from "node:test";
import {
  eachHostCalendarDay,
  hostDayBounds,
  hostStartOfToday,
} from "./slots";

test("hostDayBounds uses the host timezone calendar day", () => {
  const startTime = new Date("2025-10-29T19:00:00.000Z");
  const { fromDate, toDate } = hostDayBounds(startTime, "America/New_York");

  assert.equal(fromDate.toISOString(), "2025-10-29T04:00:00.000Z");
  assert.equal(toDate.toISOString(), "2025-10-30T03:59:59.999Z");
  assert.ok(startTime >= fromDate);
  assert.ok(startTime <= toDate);
});

test("eachHostCalendarDay walks host-local dates across UTC midnight", () => {
  const fromDate = new Date("2025-10-29T04:00:00.000Z");
  const toDate = new Date("2025-10-30T03:59:59.999Z");
  const days = eachHostCalendarDay(fromDate, toDate, "America/New_York");

  assert.equal(days.length, 1);
  assert.equal(days[0] && formatDay(days[0]), "2025-10-29");
});

test("hostStartOfToday aligns to host midnight", () => {
  const now = new Date("2025-10-29T15:30:00.000Z");
  const start = hostStartOfToday("America/New_York", now);

  assert.equal(start.toISOString(), "2025-10-29T04:00:00.000Z");
});

function formatDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

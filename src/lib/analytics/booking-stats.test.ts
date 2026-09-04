import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildBookingTrend, buildEventTypeBreakdown } from "./booking-stats";

describe("booking-stats", () => {
  it("groups bookings by created date", () => {
    const today = new Date();
    const isoToday = today.toISOString();

    const trend = buildBookingTrend(
      [
        { created_at: isoToday },
        { created_at: isoToday },
        { created_at: new Date(today.getTime() - 86_400_000).toISOString() },
      ],
      3,
    );

    assert.equal(trend.length, 3);
    assert.equal(trend.at(-1)?.count, 2);
    assert.equal(trend.at(-2)?.count, 1);
  });

  it("builds event type breakdown sorted by count", () => {
    const breakdown = buildEventTypeBreakdown([
      { event_types: { title: "Intro" } },
      { event_types: { title: "Intro" } },
      { event_types: { title: "Discovery" } },
    ]);

    assert.deepEqual(breakdown, [
      { title: "Intro", count: 2 },
      { title: "Discovery", count: 1 },
    ]);
  });
});

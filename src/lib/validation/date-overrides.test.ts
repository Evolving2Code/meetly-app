import assert from "node:assert/strict";
import test from "node:test";
import { validateDateOverride } from "./date-overrides";

test("validateDateOverride accepts blocked future dates", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toISOString().slice(0, 10);

  assert.equal(validateDateOverride({ date, available: false }), null);
});

test("validateDateOverride requires times for available overrides", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toISOString().slice(0, 10);

  assert.match(
    validateDateOverride({ date, available: true, startTime: "17:00", endTime: "09:00" })!,
    /after start time/i,
  );
});

test("validateDateOverride rejects invalid date format", () => {
  assert.match(validateDateOverride({ date: "09-02-2026", available: false })!, /YYYY-MM-DD/i);
});

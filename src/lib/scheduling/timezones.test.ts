import assert from "node:assert/strict";
import test from "node:test";
import { isValidTimezone } from "./timezones";

test("isValidTimezone accepts IANA timezones", () => {
  assert.equal(isValidTimezone("America/New_York"), true);
  assert.equal(isValidTimezone("Europe/London"), true);
  assert.equal(isValidTimezone("UTC"), true);
});

test("isValidTimezone rejects invalid values", () => {
  assert.equal(isValidTimezone("Not/A_Timezone"), false);
  assert.equal(isValidTimezone(""), false);
});

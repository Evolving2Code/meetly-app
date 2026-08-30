import assert from "node:assert/strict";
import test from "node:test";
import { normalizeUsername, validateUsername } from "./username";

test("normalizeUsername lowercases and trims", () => {
  assert.equal(normalizeUsername("  Jane-Doe  "), "jane-doe");
});

test("validateUsername accepts valid usernames", () => {
  assert.equal(validateUsername("jane"), null);
  assert.equal(validateUsername("jane-doe"), null);
  assert.equal(validateUsername("user42"), null);
});

test("validateUsername rejects invalid usernames", () => {
  assert.match(validateUsername("")!, /required/i);
  assert.match(validateUsername("a")!, /at least 2/i);
  assert.match(validateUsername("jane_doe")!, /lowercase/i);
  assert.match(validateUsername("-jane")!, /lowercase/i);
  assert.match(validateUsername("jane-")!, /lowercase/i);
});

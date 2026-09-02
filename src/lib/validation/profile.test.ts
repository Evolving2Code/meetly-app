import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDisplayName, validateDisplayName } from "./profile";

test("normalizeDisplayName trims and collapses whitespace", () => {
  assert.equal(normalizeDisplayName("  Jane   Doe  "), "Jane Doe");
});

test("validateDisplayName accepts valid names", () => {
  assert.equal(validateDisplayName("Jane Doe"), null);
});

test("validateDisplayName rejects empty names", () => {
  assert.match(validateDisplayName("   ")!, /required/i);
});

test("validateDisplayName rejects overly long names", () => {
  assert.match(validateDisplayName("a".repeat(81))!, /80 characters/i);
});

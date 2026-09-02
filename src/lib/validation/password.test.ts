import assert from "node:assert/strict";
import test from "node:test";
import { validatePassword, validatePasswordConfirmation } from "./password";

test("validatePassword enforces minimum length", () => {
  assert.match(validatePassword("short")!, /at least 8/i);
  assert.equal(validatePassword("longenough"), null);
});

test("validatePasswordConfirmation requires matching values", () => {
  assert.match(validatePasswordConfirmation("password1", "password2")!, /do not match/i);
  assert.equal(validatePasswordConfirmation("password1", "password1"), null);
});

import assert from "node:assert/strict";
import test from "node:test";
import { getCalendarOAuthRedirectUri, getSiteOrigin } from "./site-url";

test("getSiteOrigin strips trailing slash", () => {
  assert.equal(getSiteOrigin("https://meetly-evolving.vercel.app/"), "https://meetly-evolving.vercel.app");
});

test("getCalendarOAuthRedirectUri builds calendar callback path", () => {
  assert.equal(
    getCalendarOAuthRedirectUri("https://meetly-evolving.vercel.app"),
    "https://meetly-evolving.vercel.app/auth/callback/google-calendar",
  );
});

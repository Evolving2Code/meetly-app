import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
} from "./calendar-links";

describe("calendar-links", () => {
  it("builds a Google Calendar template URL", () => {
    const url = buildGoogleCalendarUrl({
      title: "Intro call",
      startTime: "2026-10-29T19:00:00.000Z",
      endTime: "2026-10-29T19:30:00.000Z",
      details: "Booked via Meetly",
      location: "Google Meet",
    });

    assert.match(url, /^https:\/\/calendar\.google\.com\/calendar\/render\?/);
    assert.match(url, /action=TEMPLATE/);
    assert.match(url, /text=Intro\+call/);
    assert.match(url, /dates=20261029T190000Z%2F20261029T193000Z/);
  });

  it("builds an Outlook compose URL", () => {
    const url = buildOutlookCalendarUrl({
      title: "Intro call",
      startTime: "2026-10-29T19:00:00.000Z",
      endTime: "2026-10-29T19:30:00.000Z",
      details: "Booked via Meetly",
    });

    assert.match(url, /^https:\/\/outlook\.live\.com\/calendar\/0\/deeplink\/compose\?/);
    assert.match(url, /subject=Intro\+call/);
    assert.match(url, /rru=addevent/);
  });
});

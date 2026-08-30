# Scheduling Engine

Core logic lives in `src/lib/scheduling/`. The slot engine answers: **"When can a guest book this event type?"**

## Inputs

| Source | Table / API | Used for |
|--------|-------------|----------|
| Weekly hours | `availability_slots` | Base windows per day of week |
| Date overrides | `date_overrides` | Replace hours on specific dates (schema only in MVP) |
| Event type config | `event_types` | Duration, buffers, min notice, max days ahead |
| Existing bookings | `bookings` (confirmed) | Conflict detection |
| Google Calendar | `freebusy.query` | External busy times (if host connected) |
| Host timezone | `profiles.timezone` | Interpreting availability windows |
| Guest timezone | Request param | Display grouping only (`format.ts`) |

## Algorithm (`getAvailableSlots`)

File: `src/lib/scheduling/slots.ts`

For each day from `fromDate` to `toDate`:

1. Determine **availability windows** for that calendar day in the host timezone
   - If a `date_overrides` row exists → use override (or skip day if unavailable)
   - Else → use `availability_slots` matching `day_of_week`
2. Within each window, step forward in increments of `duration + buffer_after`
3. For each candidate slot:
   - Apply `buffer_before` → meeting start/end → `buffer_after`
   - Skip if outside `[fromDate, toDate]` or beyond `max_days_ahead`
   - Skip if before `now + min_notice`
   - Skip if overlaps a confirmed booking
   - Skip if overlaps a Google Calendar busy interval
4. Collect remaining slots as `{ start, end }`

## Validation on book (`isSlotAvailable`)

When a guest submits a booking, the API re-runs slot calculation for **the full day** containing the chosen start time and checks the exact timestamp is still in the result set. Prevents double-booking race conditions (409 if taken).

## Event type fields

| Field | Effect |
|-------|--------|
| `duration` | Meeting length (minutes) |
| `buffer_before` | Gap before meeting start inside the window |
| `buffer_after` | Gap after meeting; also drives slot stepping |
| `min_notice` | Earliest bookable time from now (minutes) |
| `max_days_ahead` | Latest bookable date from today |

Default onboarding values: 30 min duration, 0 before / 15 after buffer, 120 min notice, 60 days ahead.

## Timezone handling

- Availability `start_time` / `end_time` are interpreted in **host timezone** via `date-fns-tz` (`fromZonedTime`, `toZonedTime`)
- Guest sees slots grouped by date in **guest timezone** (`groupSlotsByDate` in `format.ts`)
- Booking stores guest timezone on the row; Google event uses it for `dateTime` fields

## Google Calendar integration

File: `src/lib/google-calendar.ts`

| Function | Calendar API | When |
|----------|--------------|------|
| `getBusyIntervals` | `freebusy.query` | Slot calculation |
| `createGoogleCalendarEvent` | `events.insert` | After successful booking |
| `deleteGoogleCalendarEvent` | `events.delete` | Guest cancellation |

If Calendar is not connected, busy intervals return empty and events are not created — booking still succeeds in Meetly DB.

Meet link created via `conferenceData.createRequest` with `hangoutsMeet`.

## API usage

**Public slot listing:**

```
GET /api/slots?username={u}&slug={s}&timezone={tz}
```

Returns host info, event type summary, and slots grouped by date.

**Booking:**

```
POST /api/bookings
{ username, slug, guestName, guestEmail, guestNotes?, startTime, timezone }
```

## Constants

Shared timezone list: `src/lib/scheduling/constants.ts` (`TIMEZONES` array used in Settings and booking UI).

## Related

- [database.md](./database.md) — availability and bookings schema
- [api/routes.md](../api/routes.md) — `/api/slots` and `/api/bookings`

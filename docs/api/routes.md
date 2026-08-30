# API Routes

All API routes live under `src/app/api/`. Responses are JSON unless noted.

## Authentication

| Route | Auth | Description |
|-------|------|-------------|
| Host routes | Supabase session cookie | `requireAuth()` returns 401 if missing |
| Guest booking | None | Uses admin client server-side |
| Guest cancel | Cancel token query param | No session required |

---

## `GET /api/slots`

Public. Returns available booking slots for a host event type.

**Query params**

| Param | Required | Description |
|-------|----------|-------------|
| `username` | Yes | Host booking username |
| `slug` | Yes | Event type slug |
| `timezone` | No | Guest timezone for display grouping (default `America/New_York`) |

**Response `200`**

```json
{
  "host": { "name", "username", "timezone", "image" },
  "eventType": { "id", "title", "slug", "description", "duration", "location" },
  "slots": { "2026-08-30": ["2026-08-30T14:00:00.000Z", "..."] }
}
```

**Errors:** `400` missing params, `404` host or event not found

---

## `POST /api/bookings`

Public (guest). Creates a confirmed booking.

**Body**

```json
{
  "username": "jane",
  "slug": "30-min",
  "guestName": "Alex",
  "guestEmail": "alex@example.com",
  "guestNotes": "optional",
  "startTime": "2026-08-30T14:00:00.000Z",
  "timezone": "America/New_York"
}
```

**Response `201`:** booking row with nested `event_types`

**Errors:** `400` invalid data, `404` not found, `409` slot no longer available

Side effects: creates Google Calendar event if host connected.

---

## `GET /api/bookings`

Host only. Lists host's confirmed bookings.

**Query params**

| Param | Default | Values |
|-------|---------|--------|
| `status` | `upcoming` | `upcoming` \| `past` |

**Response `200`:** array of bookings with `event_types(*)`

---

## `DELETE /api/bookings?token={cancelToken}`

Public (guest). Cancels a booking by cancel token.

**Response `200`:** `{ "success": true }`

**Errors:** `400` missing token or past booking, `404` not found

Side effects: deletes Google Calendar event if present.

---

## `GET /api/profile`

Host only. Returns profile + email.

---

## `PATCH /api/profile`

Host only. Update profile fields.

**Body (partial)**

```json
{
  "username": "new-name",
  "timezone": "America/Los_Angeles"
}
```

---

## `GET /api/event-types`

Host only. List all event types for current user.

---

## `POST /api/event-types`

Host only. Create event type.

**Body**

```json
{
  "title": "30 Minute Meeting",
  "slug": "30-min",
  "duration": 30,
  "description": "...",
  "bufferBefore": 0,
  "bufferAfter": 15,
  "minNotice": 120,
  "maxDaysAhead": 60,
  "location": "Google Meet"
}
```

**Response `201`:** created event type

---

## `PATCH /api/event-types/[id]`

Host only. Update event type (partial body, same field names as POST).

---

## `DELETE /api/event-types/[id]`

Host only. Delete event type.

**Response `200`:** `{ "success": true }`

---

## `GET /api/availability`

Host only. List weekly availability slots.

---

## `PUT /api/availability`

Host only. Replace all availability slots.

**Body**

```json
{
  "slots": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00" }
  ]
}
```

Deletes existing slots for user, inserts new set.

---

## `GET /api/integrations/google/connect`

Host only. Redirects to Google OAuth consent for Calendar scopes.

---

## `DELETE /api/integrations/google/connect`

Host only. Disconnects Google Calendar (removes `google_tokens` row).

**Response `200`:** `{ "success": true }`

---

## Auth callbacks (not under `/api`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/auth/callback` | GET | Supabase OAuth code exchange → dashboard |
| `/auth/callback/google-calendar` | GET | Calendar OAuth code exchange → settings |

## Related

- [architecture/scheduling.md](../architecture/scheduling.md) — slot logic behind `/api/slots`
- [architecture/auth.md](../architecture/auth.md) — OAuth callbacks

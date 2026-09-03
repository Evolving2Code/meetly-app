export function buildIcsCalendarEvent(params: {
  uid: string;
  title: string;
  description: string;
  location?: string | null;
  startTime: Date;
  endTime: Date;
  timezone: string;
  organizerEmail?: string | null;
  organizerName?: string | null;
  attendeeEmail: string;
  attendeeName: string;
  url?: string | null;
}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Meetly//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcs(params.uid)}`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsUtc(params.startTime)}`,
    `DTEND:${formatIcsUtc(params.endTime)}`,
    `SUMMARY:${escapeIcs(params.title)}`,
    `DESCRIPTION:${escapeIcs(params.description)}`,
  ];

  if (params.location) {
    lines.push(`LOCATION:${escapeIcs(params.location)}`);
  }

  if (params.organizerEmail) {
    lines.push(
      `ORGANIZER;CN=${escapeIcs(params.organizerName ?? "Host")}:mailto:${escapeIcs(params.organizerEmail)}`,
    );
  }

  lines.push(`ATTENDEE;CN=${escapeIcs(params.attendeeName)};ROLE=REQ-PARTICIPANT:mailto:${escapeIcs(params.attendeeEmail)}`);

  if (params.url) {
    lines.push(`URL:${escapeIcs(params.url)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return `${lines.join("\r\n")}\r\n`;
}

function formatIcsUtc(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

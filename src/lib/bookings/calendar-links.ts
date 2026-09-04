function formatGoogleCalendarDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildGoogleCalendarUrl({
  title,
  startTime,
  endTime,
  details,
  location,
}: {
  title: string;
  startTime: string;
  endTime: string;
  details?: string;
  location?: string;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatGoogleCalendarDate(startTime)}/${formatGoogleCalendarDate(endTime)}`,
  });

  if (details) {
    params.set("details", details);
  }

  if (location) {
    params.set("location", location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl({
  title,
  startTime,
  endTime,
  details,
  location,
}: {
  title: string;
  startTime: string;
  endTime: string;
  details?: string;
  location?: string;
}) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: new Date(startTime).toISOString(),
    enddt: new Date(endTime).toISOString(),
  });

  if (details) {
    params.set("body", details);
  }

  if (location) {
    params.set("location", location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

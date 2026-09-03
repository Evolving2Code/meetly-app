import { format } from "date-fns";
import type { CalendarEvent } from "@/lib/calendar/merge-events";

export function CalendarEventCard({ event }: { event: CalendarEvent }) {
  const content = (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        event.source === "meetly"
          ? "border-lime/40 bg-lime/10"
          : "border-primary/20 bg-primary-light/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-navy">{event.title}</p>
          <p className="mt-1 text-sm text-muted">
            {format(new Date(event.start), "h:mm a")} – {format(new Date(event.end), "h:mm a")}
          </p>
          {event.guestEmail && <p className="mt-1 text-sm text-muted">{event.guestEmail}</p>}
          {event.location && <p className="mt-1 text-sm text-muted">{event.location}</p>}
        </div>
        <span
          className={
            event.source === "meetly" ? "badge-lime" : "badge bg-primary-light text-primary-dark"
          }
        >
          {event.source === "meetly" ? "Meetly" : "Google"}
        </span>
      </div>
    </div>
  );

  if (event.source === "google" && event.htmlLink) {
    return (
      <a href={event.htmlLink} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

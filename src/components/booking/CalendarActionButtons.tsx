import Link from "next/link";
import { GoogleCalendarIcon, MicrosoftIcon } from "@/components/icons/BrandIcons";
import {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
} from "@/lib/bookings/calendar-links";

function AppleCalendarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#FFFFFF" stroke="#D1D5DB" />
      <rect x="3" y="5" width="18" height="5" rx="2" fill="#111827" />
      <text x="12" y="17" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="700">
        29
      </text>
    </svg>
  );
}

type CalendarActionButtonsProps = {
  eventTitle: string;
  hostName: string;
  startTime: string;
  endTime: string;
  icsUrl: string;
  location?: string | null;
};

export function CalendarActionButtons({
  eventTitle,
  hostName,
  startTime,
  endTime,
  icsUrl,
  location,
}: CalendarActionButtonsProps) {
  const title = `${eventTitle} with ${hostName}`;
  const details = `Booked via Meetly with ${hostName}.`;

  const googleUrl = buildGoogleCalendarUrl({
    title,
    startTime,
    endTime,
    details,
    location: location ?? undefined,
  });

  const outlookUrl = buildOutlookCalendarUrl({
    title,
    startTime,
    endTime,
    details,
    location: location ?? undefined,
  });

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition hover:bg-surface active:scale-[0.98]"
      >
        <GoogleCalendarIcon size={18} />
        Google Calendar
      </a>
      <a
        href={icsUrl}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition hover:bg-surface active:scale-[0.98]"
      >
        <AppleCalendarIcon />
        Apple Calendar
      </a>
      <a
        href={outlookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition hover:bg-surface active:scale-[0.98]"
      >
        <MicrosoftIcon size={18} />
        Outlook
      </a>
    </div>
  );
}

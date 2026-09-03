import Link from "next/link";
import { CalendarWeekView } from "@/components/dashboard/CalendarWeekView";
import { isGoogleCalendarConnected } from "@/lib/google-calendar";
import { requireUser } from "@/lib/auth/session";

export default async function CalendarPage() {
  const user = await requireUser();
  const googleCalendarConnected = await isGoogleCalendarConnected(user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
            Schedule
          </p>
          <h1 className="mt-1 text-3xl font-black text-navy sm:mt-2 sm:text-4xl">Calendar</h1>
          <p className="mt-2 max-w-2xl text-muted">
            See Meetly bookings and your connected Google Calendar events in one place.
          </p>
        </div>
        {!googleCalendarConnected && (
          <Link href="/dashboard/settings" className="btn-secondary min-h-[44px]">
            Connect Google Calendar
          </Link>
        )}
      </div>

      <CalendarWeekView />
    </div>
  );
}

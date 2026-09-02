import Link from "next/link";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isGoogleCalendarConnected } from "@/lib/google-calendar";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [
    { data: profile },
    { data: upcomingBookings },
    { count: weekBookings },
    { data: eventTypes },
    calendarConnected,
  ] = await Promise.all([
    supabase.from("profiles").select("username, timezone").eq("id", user.id).single(),
    supabase
      .from("bookings")
      .select("*, event_types(*)")
      .eq("host_id", user.id)
      .eq("status", "confirmed")
      .gte("start_time", now.toISOString())
      .order("start_time", { ascending: true })
      .limit(5),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("host_id", user.id)
      .eq("status", "confirmed")
      .gte("start_time", weekStart.toISOString())
      .lte("start_time", weekEnd.toISOString()),
    supabase
      .from("event_types")
      .select("*")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("created_at", { ascending: true }),
    isGoogleCalendarConnected(user.id),
  ]);

  const bookingLink =
    profile?.username && eventTypes?.[0]
      ? `/book/${profile.username}/${eventTypes[0].slug}`
      : null;

  const availabilityHeatmap = await buildHeatmap(supabase, user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-black text-navy sm:mt-2 sm:text-4xl">Dashboard</h1>
        </div>
        {bookingLink && <CopyLinkButton path={bookingLink} label="Copy booking link" />}
      </div>

      <div className="mb-8">
        <PwaInstallPrompt variant="card" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Meetings this week" value={String(weekBookings ?? 0)} accent />
        <StatCard label="Active event types" value={String(eventTypes?.length ?? 0)} />
        <StatCard
          label="Google Calendar"
          value={calendarConnected ? "Connected" : "Not connected"}
        />
        <StatCard label="Timezone" value={profile?.timezone ?? "America/New_York"} small />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black">Upcoming meetings</h2>
            <div className="flex items-center gap-3">
              <span className="badge-lime">{upcomingBookings?.length ?? 0} scheduled</span>
              <Link
                href="/dashboard/bookings"
                className="text-sm font-semibold text-lime-dark hover:underline"
              >
                View all
              </Link>
            </div>
          </div>

          {!upcomingBookings?.length ? (
            <div className="rounded-2xl bg-surface p-8 text-center">
              <p className="font-semibold text-navy">No upcoming meetings yet</p>
              <p className="mt-2 text-sm text-muted">
                Share your booking link to start filling your calendar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border px-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-navy">{booking.guest_name}</p>
                    <p className="text-sm text-muted">{booking.event_types?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-navy">
                      {format(new Date(booking.start_time), "EEE, MMM d")}
                    </p>
                    <p className="text-sm text-muted">
                      {format(new Date(booking.start_time), "h:mm a")} –{" "}
                      {format(new Date(booking.end_time), "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="text-xl font-black">Availability heatmap</h2>
          <p className="mt-2 text-sm text-muted">Your weekly open hours at a glance.</p>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {availabilityHeatmap.map((day) => (
              <div key={day.label} className="text-center">
                <p className="mb-2 text-xs font-semibold text-muted">{day.label}</p>
                <div
                  className={`mx-auto flex h-16 w-full items-end justify-center rounded-xl ${
                    day.hours > 0 ? "bg-lime/20" : "bg-surface"
                  }`}
                >
                  <div
                    className={`w-4 rounded-full ${day.hours > 0 ? "bg-lime" : "bg-border"}`}
                    style={{ height: `${Math.max(20, Math.min(100, day.hours * 8))}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-navy">{day.hours}h</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black">Event types</h2>
          <Link
            href="/dashboard/event-types"
            className="text-sm font-semibold text-lime-dark hover:underline"
          >
            Manage all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {eventTypes?.map((eventType) => (
            <div
              key={eventType.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-navy">{eventType.title}</p>
                  <p className="mt-1 text-sm text-muted">{eventType.duration} minutes</p>
                </div>
                <span className="badge-navy">{eventType.slug}</span>
              </div>
              {profile?.username && (
                <p className="mt-4 truncate text-sm text-muted">
                  /book/{profile.username}/{eventType.slug}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
  small = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="card">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p
        className={`mt-3 font-black text-navy ${small ? "text-lg" : "text-4xl"} ${
          accent ? "text-lime-dark" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

async function buildHeatmap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data: availability } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("user_id", userId);

  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return labels.map((label, index) => {
    const daySlots = (availability ?? []).filter((slot) => slot.day_of_week === index);
    const hours = daySlots.reduce((total, slot) => {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);
      return total + (endHour + endMin / 60) - (startHour + startMin / 60);
    }, 0);

    return { label, hours: Math.round(hours) };
  });
}

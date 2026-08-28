import Link from "next/link";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGoogleCalendarConnected } from "@/lib/google-calendar";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [user, upcomingBookings, weekBookings, eventTypes, calendarConnected] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, timezone: true },
      }),
      prisma.booking.findMany({
        where: {
          hostId: userId,
          status: "confirmed",
          startTime: { gte: now },
        },
        include: { eventType: true },
        orderBy: { startTime: "asc" },
        take: 5,
      }),
      prisma.booking.count({
        where: {
          hostId: userId,
          status: "confirmed",
          startTime: { gte: weekStart, lte: weekEnd },
        },
      }),
      prisma.eventType.findMany({
        where: { userId, active: true },
        orderBy: { createdAt: "asc" },
      }),
      isGoogleCalendarConnected(userId),
    ]);

  const bookingLink =
    user?.username && eventTypes[0]
      ? `/book/${user.username}/${eventTypes[0].slug}`
      : null;

  const availabilityHeatmap = await buildHeatmap(userId);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
            Overview
          </p>
          <h1 className="mt-2 text-4xl font-black text-navy">Dashboard</h1>
        </div>
        {bookingLink && (
          <CopyLinkButton
            path={bookingLink}
            label="Copy booking link"
          />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Meetings this week" value={String(weekBookings)} accent />
        <StatCard label="Active event types" value={String(eventTypes.length)} />
        <StatCard
          label="Google Calendar"
          value={calendarConnected ? "Connected" : "Not connected"}
        />
        <StatCard label="Timezone" value={user?.timezone ?? "America/New_York"} small />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black">Upcoming meetings</h2>
            <span className="badge-lime">{upcomingBookings.length} scheduled</span>
          </div>

          {upcomingBookings.length === 0 ? (
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
                    <p className="font-semibold text-navy">{booking.guestName}</p>
                    <p className="text-sm text-muted">{booking.eventType.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-navy">
                      {format(booking.startTime, "EEE, MMM d")}
                    </p>
                    <p className="text-sm text-muted">
                      {format(booking.startTime, "h:mm a")} – {format(booking.endTime, "h:mm a")}
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
          <Link href="/dashboard/event-types" className="text-sm font-semibold text-lime-dark hover:underline">
            Manage all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {eventTypes.map((eventType) => (
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
              {user?.username && (
                <p className="mt-4 truncate text-sm text-muted">
                  /book/{user.username}/{eventType.slug}
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

async function buildHeatmap(userId: string) {
  const availability = await prisma.availabilitySlot.findMany({
    where: { userId },
  });

  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return labels.map((label, index) => {
    const daySlots = availability.filter((slot) => slot.dayOfWeek === index);
    const hours = daySlots.reduce((total, slot) => {
      const [startHour, startMin] = slot.startTime.split(":").map(Number);
      const [endHour, endMin] = slot.endTime.split(":").map(Number);
      return total + (endHour + endMin / 60) - (startHour + startMin / 60);
    }, 0);

    return { label, hours: Math.round(hours) };
  });
}

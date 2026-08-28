import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGoogleCalendarConnected } from "@/lib/google-calendar";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  const [user, calendarConnected] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session!.user.id },
      select: {
        username: true,
        timezone: true,
        email: true,
        name: true,
      },
    }),
    isGoogleCalendarConnected(session!.user.id),
  ]);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
          Account
        </p>
        <h1 className="mt-2 text-4xl font-black text-navy">Settings</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Manage your profile, timezone, and Google Calendar connection.
        </p>
      </div>

      <SettingsForm
        user={user}
        calendarConnected={calendarConnected}
      />
    </div>
  );
}

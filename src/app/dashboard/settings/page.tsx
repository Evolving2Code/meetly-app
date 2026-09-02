import { requireUser } from "@/lib/auth/session";
import { isEmailAuthUser } from "@/lib/auth/providers";
import { createClient } from "@/lib/supabase/server";
import { isGoogleCalendarConnected } from "@/lib/google-calendar";
import { getNotificationPreferences } from "@/lib/notifications/preferences";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { NotificationPreferencesForm } from "@/components/dashboard/NotificationPreferencesForm";
import { PasswordChangeForm } from "@/components/dashboard/PasswordChangeForm";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function SettingsPage({
  searchParams,
}: PageProps<"/dashboard/settings">) {
  const user = await requireUser();
  const supabase = await createClient();
  const params = await searchParams;
  const calendarStatus =
    typeof params.calendar === "string" ? params.calendar : null;

  const [{ data: profile }, calendarConnected, notificationPreferences] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, timezone, name, avatar_url")
      .eq("id", user.id)
      .single(),
    isGoogleCalendarConnected(user.id),
    getNotificationPreferences(supabase, user.id),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const isEmailUser = isEmailAuthUser(user);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
          Account
        </p>
        <h1 className="mt-1 text-3xl font-black text-navy sm:mt-2 sm:text-4xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Manage your profile, notifications, timezone, and Google Calendar connection.
        </p>
      </div>

      <SettingsForm
        user={{
          username: profile?.username ?? null,
          timezone: profile?.timezone ?? "America/New_York",
          email: user.email ?? "",
          name: profile?.name ?? null,
          avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
        }}
        siteUrl={siteUrl}
        calendarConnected={calendarConnected}
        calendarStatus={calendarStatus}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <NotificationPreferencesForm
          initialPreferences={{
            emailOnNewBooking: notificationPreferences.email_on_new_booking,
            emailGuestConfirmation: notificationPreferences.email_guest_confirmation,
            emailBookingReminder: notificationPreferences.email_booking_reminder,
            reminderHoursBefore: notificationPreferences.reminder_hours_before,
          }}
        />
        {isEmailUser && user.email ? <PasswordChangeForm email={user.email} /> : null}
      </div>

      <section className="card mt-6">
        <h2 className="text-lg font-black text-navy">Sign out</h2>
        <p className="mt-2 text-sm text-muted">Sign out of Meetly on this device.</p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}

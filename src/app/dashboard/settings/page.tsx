import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isGoogleCalendarConnected } from "@/lib/google-calendar";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function SettingsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: profile }, calendarConnected] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, timezone, name")
      .eq("id", user.id)
      .single(),
    isGoogleCalendarConnected(user.id),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
          Account
        </p>
        <h1 className="mt-1 text-3xl font-black text-navy sm:mt-2 sm:text-4xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Manage your profile, timezone, and Google Calendar connection.
        </p>
      </div>

      <SettingsForm
        user={{
          username: profile?.username ?? null,
          timezone: profile?.timezone ?? "America/New_York",
          email: user.email ?? "",
          name: profile?.name ?? null,
        }}
        calendarConnected={calendarConnected}
      />

      <section className="card mt-6 lg:hidden">
        <h2 className="text-lg font-black text-navy">Sign out</h2>
        <p className="mt-2 text-sm text-muted">Sign out of Meetly on this device.</p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { MeetlyIcon } from "@/components/marketing/MeetlyIcon";
import { requireUser } from "@/lib/auth/session";
import { ensureUserOnboarded } from "@/lib/auth/onboarding";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav, type NavItem } from "@/components/dashboard/DashboardNav";
import { UserProfileMenu } from "@/components/dashboard/UserProfileMenu";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", shortLabel: "Home", icon: "overview" },
  { href: "/dashboard/calendar", label: "Calendar", shortLabel: "Calendar", icon: "calendar" },
  { href: "/dashboard/bookings", label: "Bookings", shortLabel: "Bookings", icon: "bookings" },
  { href: "/dashboard/contacts", label: "Contacts", shortLabel: "Contacts", icon: "contacts" },
  { href: "/dashboard/event-types", label: "Event Types", shortLabel: "Events", icon: "events" },
  { href: "/dashboard/availability", label: "Availability", shortLabel: "Hours", icon: "availability" },
  { href: "/dashboard/settings", label: "Settings", shortLabel: "Settings", icon: "settings" },
];

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await requireUser();
  await ensureUserOnboarded(user.id, user.email!, user.user_metadata);
  const supabase = await createClient();

  const [{ data: profile }, { data: eventTypes }] = await Promise.all([
    supabase.from("profiles").select("name, avatar_url, username").eq("id", user.id).single(),
    supabase
      .from("event_types")
      .select("slug")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("created_at", { ascending: true })
      .limit(1),
  ]);

  const displayName = profile?.name ?? user.email ?? "User";
  const avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url;
  const bookingPageUrl =
    profile?.username && eventTypes?.[0]
      ? `/book/${profile.username}/${eventTypes[0].slug}`
      : null;

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden bg-navy text-white lg:block">
        <div className="flex h-full flex-col p-6">
          <Link href="/dashboard" className="mb-10 flex items-center gap-3">
            <MeetlyIcon className="h-10 w-10" />
            <div>
              <p className="text-lg font-bold">Meetly</p>
              <p className="text-xs text-slate-400">Host dashboard</p>
            </div>
          </Link>

          <DashboardNav items={navItems} variant="sidebar" />

          <div className="mt-auto rounded-2xl bg-navy-light p-4">
            <UserProfileMenu
              displayName={displayName}
              email={user.email ?? ""}
              avatarUrl={avatarUrl}
              bookingPageUrl={bookingPageUrl}
              variant="sidebar"
            />
          </div>
        </div>
      </aside>

      {/* Mobile shell */}
      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <MeetlyIcon className="h-9 w-9" />
            <span className="text-base font-bold text-navy">Meetly</span>
          </Link>
          <UserProfileMenu
            displayName={displayName}
            email={user.email ?? ""}
            avatarUrl={avatarUrl}
            bookingPageUrl={bookingPageUrl}
            variant="header"
          />
        </header>

        <main className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>

        <DashboardNav items={navItems} variant="bottom" />
      </div>
    </div>
  );
}

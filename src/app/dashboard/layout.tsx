import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { ensureUserOnboarded } from "@/lib/auth/onboarding";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav, type NavItem } from "@/components/dashboard/DashboardNav";
import { SignOutButton } from "@/components/auth/SignOutButton";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", shortLabel: "Home", icon: "overview" },
  { href: "/dashboard/event-types", label: "Event Types", shortLabel: "Events", icon: "events" },
  { href: "/dashboard/availability", label: "Availability", shortLabel: "Hours", icon: "availability" },
  { href: "/dashboard/settings", label: "Settings", shortLabel: "Settings", icon: "settings" },
];

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await requireUser();
  await ensureUserOnboarded(user.id, user.email!, user.user_metadata);
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName = profile?.name ?? user.email ?? "User";
  const avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden bg-navy text-white lg:block">
        <div className="flex h-full flex-col p-6">
          <Link href="/dashboard" className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-lg font-black text-navy">
              M
            </div>
            <div>
              <p className="text-lg font-bold">Meetly</p>
              <p className="text-xs text-slate-400">Host dashboard</p>
            </div>
          </Link>

          <DashboardNav items={navItems} variant="sidebar" />

          <div className="mt-auto rounded-2xl bg-navy-light p-4">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="h-10 w-10 rounded-full" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime font-bold text-navy">
                  {displayName.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <div className="mt-4">
              <SignOutButton variant="sidebar" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile shell */}
      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-sm font-black text-navy">
              M
            </div>
            <span className="text-base font-bold text-navy">Meetly</span>
          </Link>
          <div className="flex items-center gap-1">
            <SignOutButton variant="header" />
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="h-9 w-9 rounded-full" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {displayName.slice(0, 1)}
              </div>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>

        <DashboardNav items={navItems} variant="bottom" />
      </div>
    </div>
  );
}

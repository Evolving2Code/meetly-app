import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { SignOutButton } from "@/components/auth/SignOutButton";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/event-types", label: "Event Types" },
  { href: "/dashboard/availability", label: "Availability" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await requireUser();
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
      <aside className="bg-navy text-white">
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

          <DashboardNav items={navItems} />

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
              <SignOutButton />
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}

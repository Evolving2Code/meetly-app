"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: "overview" | "calendar" | "bookings" | "contacts" | "events" | "availability" | "settings";
};

const icons = {
  overview: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 0 0 2-2V7H3v12a2 2 0 0 0 2 2z" />
      <path d="M8 15h8" />
    </svg>
  ),
  bookings: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  contacts: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
      <path d="M8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z" />
      <path d="M8 13c-2.67 0-8 1.34-8 4v2h8" />
      <path d="M16 13c-.34 0-.67.02-1 .06 2.34.56 4 2.04 4 3.94v2h6v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  events: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M12 4h9" />
      <path d="M4 9h16" />
      <path d="M4 15h16" />
    </svg>
  ),
  availability: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  settings: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
};

export function DashboardNav({
  items,
  variant = "sidebar",
}: {
  items: NavItem[];
  variant?: "sidebar" | "bottom";
}) {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav className="dashboard-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-navy pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto flex max-w-lg overflow-x-auto">
          {items.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dashboard-bottom-link flex min-h-[56px] min-w-[4.75rem] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-[10px] font-semibold transition ${
                  active ? "dashboard-bottom-link-active" : ""
                }`}
              >
                <span className={`dashboard-nav-icon ${active ? "" : "text-slate-400"}`}>
                  {icons[item.icon]}
                </span>
                <span className="truncate">{item.shortLabel ?? item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`dashboard-nav-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? "dashboard-nav-link-active"
                : "text-slate-300 hover:bg-navy-light hover:text-white"
            }`}
          >
            <span className={`dashboard-nav-icon ${active ? "" : "text-slate-400"}`}>
              {icons[item.icon]}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

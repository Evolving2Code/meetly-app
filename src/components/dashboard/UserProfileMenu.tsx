"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SignOutButton } from "@/components/auth/SignOutButton";

type UserProfileMenuProps = {
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bookingPageUrl: string | null;
  variant?: "header" | "sidebar";
};

type MenuItem = {
  href?: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  onClick?: () => void;
};

export function UserProfileMenu({
  displayName,
  email,
  avatarUrl,
  bookingPageUrl,
  variant = "header",
}: UserProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const menuItems: MenuItem[] = [
    {
      href: "/dashboard/settings",
      label: "Profile",
      icon: <UserIcon />,
    },
    ...(bookingPageUrl
      ? [
          {
            href: bookingPageUrl,
            label: "My booking page",
            icon: <CalendarIcon />,
            external: true,
          } satisfies MenuItem,
        ]
      : []),
    {
      href: "/dashboard/contacts",
      label: "Contacts",
      icon: <ContactsIcon />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <SettingsIcon />,
    },
  ];

  const isSidebar = variant === "sidebar";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center gap-2 rounded-2xl transition ${
          isSidebar
            ? "w-full text-left hover:bg-navy-light/80"
            : "min-h-[44px] rounded-full px-1 hover:bg-surface"
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className={`rounded-full object-cover ${isSidebar ? "h-10 w-10" : "h-9 w-9"}`}
          />
        ) : (
          <div
            className={`flex items-center justify-center rounded-full font-bold ${
              isSidebar
                ? "h-10 w-10 bg-lime text-navy"
                : "h-9 w-9 bg-navy text-sm text-white"
            }`}
          >
            {displayName.slice(0, 1)}
          </div>
        )}

        {isSidebar ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-slate-400">{email}</p>
          </div>
        ) : null}

        <ChevronIcon className={isSidebar ? "text-slate-400" : "text-muted"} open={open} />
      </button>

      {open && (
        <div
          className={`absolute z-50 w-72 overflow-hidden rounded-2xl border border-border bg-background shadow-xl ${
            isSidebar ? "bottom-full left-0 mb-3" : "right-0 top-full mt-2"
          }`}
          role="menu"
        >
          <div className="border-b border-border px-4 py-4">
            <p className="font-bold text-navy">{displayName}</p>
            <p className="mt-1 truncate text-sm text-muted">{email}</p>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <MenuLink key={item.label} item={item} onNavigate={() => setOpen(false)} />
            ))}
          </div>

          <div className="border-t border-border py-2">
            <SignOutButton variant="menu" onSignedOut={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  item,
  onNavigate,
}: {
  item: MenuItem;
  onNavigate: () => void;
}) {
  const content = (
    <>
      <span className="text-muted">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.external ? <ExternalIcon /> : null}
    </>
  );

  if (item.href) {
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-surface"
          role="menuitem"
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-surface"
        role="menuitem"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        item.onClick?.();
        onNavigate();
      }}
      className="flex min-h-[44px] w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-navy transition hover:bg-surface"
      role="menuitem"
    >
      {content}
    </button>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 0 0 2-2V7H3v12a2 2 0 0 0 2 2z" />
    </svg>
  );
}

function ContactsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
      <path d="M8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z" />
      <path d="M8 13c-2.67 0-8 1.34-8 4v2h8" />
      <path d="M16 13c-.34 0-.67.02-1 .06 2.34.56 4 2.04 4 3.94v2h6v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

function ChevronIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition ${open ? "rotate-180" : ""} ${className ?? ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

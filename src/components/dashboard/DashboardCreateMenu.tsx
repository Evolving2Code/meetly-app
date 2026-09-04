"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DashboardCreateMenuProps = {
  bookingLink: string | null;
};

export function DashboardCreateMenu({ bookingLink }: DashboardCreateMenuProps) {
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

  async function copyBookingLink() {
    if (!bookingLink) {
      return;
    }

    const url = `${window.location.origin}${bookingLink}`;
    await navigator.clipboard.writeText(url);
    setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="btn-primary min-h-[44px] gap-2"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <PlusIcon />
        Create
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
          role="menu"
        >
          <div className="py-2">
            <MenuLink href="/dashboard/event-types" onNavigate={() => setOpen(false)}>
              <CalendarIcon />
              New event type
            </MenuLink>
            <MenuLink href="/dashboard/contacts?add=1" onNavigate={() => setOpen(false)}>
              <ContactsIcon />
              Add contact
            </MenuLink>
            <MenuLink href="/dashboard/availability" onNavigate={() => setOpen(false)}>
              <ClockIcon />
              Update availability
            </MenuLink>
            {bookingLink && (
              <button
                type="button"
                onClick={copyBookingLink}
                className="flex min-h-[44px] w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-navy transition hover:bg-surface"
                role="menuitem"
              >
                <LinkIcon />
                Copy booking link
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-surface"
      role="menuitem"
    >
      {children}
    </Link>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
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

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

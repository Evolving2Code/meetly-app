"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type DashboardCreateMenuProps = {
  bookingLink: string | null;
};

const MENU_WIDTH = 256;
const MENU_ESTIMATED_HEIGHT = 220;
const VIEWPORT_MARGIN = 16;

export function DashboardCreateMenu({ bookingLink }: DashboardCreateMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();
      let left = rect.right - MENU_WIDTH;
      left = Math.max(
        VIEWPORT_MARGIN,
        Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN),
      );

      let top = rect.bottom + 8;
      if (top + MENU_ESTIMATED_HEIGHT > window.innerHeight - VIEWPORT_MARGIN) {
        top = Math.max(VIEWPORT_MARGIN, rect.top - MENU_ESTIMATED_HEIGHT - 8);
      }

      setMenuPosition({ top, left });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function copyBookingLink() {
    if (!bookingLink) {
      return;
    }

    const url = `${window.location.origin}${bookingLink}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }

  const menu =
    mounted && open && menuPosition
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed z-[200] w-64 overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
            style={{ top: menuPosition.top, left: menuPosition.left }}
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
              {bookingLink ? (
                <button
                  type="button"
                  onClick={copyBookingLink}
                  className="flex min-h-[44px] w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-navy transition hover:bg-surface"
                  role="menuitem"
                >
                  <LinkIcon />
                  {copied ? "Copied!" : "Copy booking link"}
                </button>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="btn-primary relative z-[1] min-h-[44px] gap-2"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <PlusIcon />
        Create
      </button>
      {menu}
    </>
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

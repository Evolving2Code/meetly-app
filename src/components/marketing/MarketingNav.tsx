"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/">
          <MeetlyLogo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-navy transition hover:bg-surface md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <ThemeToggle className="hidden sm:inline-flex" />

          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary px-5">
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-navy transition hover:bg-surface sm:inline-flex"
              >
                Log in
              </Link>
              <a href="#get-started" className="btn-primary px-5">
                Get started
              </a>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center rounded-xl px-4 text-sm font-semibold text-navy transition hover:bg-surface"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {!isLoggedIn && (
              <Link
                href="/login"
                className="flex min-h-[44px] items-center rounded-xl px-4 text-sm font-semibold text-navy transition hover:bg-surface"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

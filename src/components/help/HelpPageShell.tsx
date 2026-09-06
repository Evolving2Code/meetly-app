import Link from "next/link";
import { ReactNode } from "react";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const HELP_LAST_UPDATED = "September 6, 2026";

export function HelpPageShell({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href={isLoggedIn ? "/dashboard" : "/"}>
            <MeetlyLogo />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-sm font-semibold text-primary hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-primary hover:underline">
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Help</p>
        <h1 className="mt-3 text-4xl font-bold text-navy">Meetly host guide</h1>
        <p className="mt-4 text-muted">Last updated: {HELP_LAST_UPDATED}</p>
        <div className="legal-prose mt-8 space-y-6 text-muted">{children}</div>
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="btn-primary mt-10 inline-flex"
        >
          {isLoggedIn ? "Back to dashboard" : "Back to home"}
        </Link>
      </main>
    </div>
  );
}

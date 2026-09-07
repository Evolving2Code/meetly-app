import Link from "next/link";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReactNode } from "react";

export const LEGAL_LAST_UPDATED = "September 2, 2026";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 px-4 py-4 backdrop-blur-lg sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href="/">
            <MeetlyLogo />
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <p className="mt-4 text-muted">Last updated: {LEGAL_LAST_UPDATED}</p>
        <div className="legal-prose mt-8 space-y-6 text-muted">{children}</div>
        <Link href="/" className="btn-primary mt-10 inline-flex">
          Back to home
        </Link>
      </main>
    </div>
  );
}

import Link from "next/link";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <Link href="/">
          <MeetlyLogo />
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold text-navy">Terms of Service</h1>
        <p className="mt-4 text-muted">Last updated: August 30, 2026</p>
        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-muted">
          <p>
            This is a placeholder terms of service for Meetly MVP. Replace this page with your
            final legal copy before public launch.
          </p>
          <p>
            By using Meetly, you agree to use the service responsibly and not misuse booking
            links, attempt unauthorized access, or violate applicable laws.
          </p>
          <p>
            Meetly is provided as-is during the MVP phase. Features, pricing, and availability
            may change.
          </p>
        </div>
        <Link href="/" className="btn-primary mt-10 inline-flex">
          Back to home
        </Link>
      </main>
    </div>
  );
}

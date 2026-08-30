import Link from "next/link";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <Link href="/">
          <MeetlyLogo />
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold text-navy">Privacy Policy</h1>
        <p className="mt-4 text-muted">Last updated: August 30, 2026</p>
        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-muted">
          <p>
            This is a placeholder privacy policy for Meetly MVP. Replace this page with your
            final legal copy before public launch.
          </p>
          <p>
            Meetly collects account information (email, name), scheduling data (availability,
            bookings), and optional Google Calendar tokens when you connect Calendar in Settings.
          </p>
          <p>
            Data is stored in Supabase (Postgres) and processed according to your configuration.
            Contact the site owner for data access or deletion requests.
          </p>
        </div>
        <Link href="/" className="btn-primary mt-10 inline-flex">
          Back to home
        </Link>
      </main>
    </div>
  );
}

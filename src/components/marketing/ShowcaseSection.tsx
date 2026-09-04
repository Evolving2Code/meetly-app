import Link from "next/link";
import { DashboardScreenshot } from "@/components/marketing/ProductScreenshots";

export function ShowcaseSection() {
  return (
    <section className="bg-navy py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative">
          <DashboardScreenshot />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-3xl bg-gradient-to-t from-navy/90 via-navy/20 to-transparent p-6 sm:p-8">
            <p className="text-sm font-semibold text-white/70">Host dashboard</p>
            <p className="mt-2 text-2xl font-bold">Manage bookings from any device</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Built for hosts</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            A dashboard that feels as polished as your booking page
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Mobile-first navigation, event type management, availability editing, and optional
            Google Calendar connection — all in one place.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Overview with upcoming meetings and shareable links",
              "Event types with duration, buffers, and booking limits",
              "Weekly availability editor with timezone support",
              "Install as a PWA on your phone",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-200">
                <span className="mt-1 text-accent">●</span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/signup" className="btn-primary mt-10 inline-flex bg-white px-8 text-navy hover:bg-slate-100">
            Start for free
          </Link>
        </div>
      </div>
    </section>
  );
}

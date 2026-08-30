import Image from "next/image";
import { HeroAuthPanel } from "@/components/marketing/HeroAuthPanel";

export function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="get-started" className="marketing-gradient overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <p className="inline-flex items-center rounded-full border border-primary/15 bg-primary-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Scheduling made simple
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Share your link.
            <span className="block bg-gradient-to-r from-primary via-accent to-accent-warm bg-clip-text text-transparent">
              Fill your calendar.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Meetly helps solo hosts share a booking page, set availability, and let guests
            pick a time — with optional Google Calendar sync when you&apos;re ready.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-navy sm:text-base">
            {[
              "Free for solo hosts — no credit card",
              "Email, Google, or Microsoft sign-in",
              "Connect Google Calendar later in Settings",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs text-primary">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-accent-warm/10 blur-3xl" />
          <div className="relative space-y-5">
            <HeroAuthPanel isLoggedIn={isLoggedIn} />
            <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80"
                alt="Professional reviewing a calendar on laptop"
                width={1200}
                height={700}
                className="h-48 w-full object-cover sm:h-56"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

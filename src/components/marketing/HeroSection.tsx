import { HeroAuthPanel } from "@/components/marketing/HeroAuthPanel";
import { HeroBookingScreenshot } from "@/components/marketing/ProductScreenshots";

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
            pick a time. Connect Google Calendar anytime — no pressure at signup.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-navy sm:text-base">
            {[
              "Free for solo hosts — no credit card",
              "Email, Google, or Microsoft sign-in",
              "Connect Google Calendar anytime in Settings",
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
            <HeroBookingScreenshot />
          </div>
        </div>
      </div>
    </section>
  );
}

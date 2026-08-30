import Link from "next/link";
import { HeroAuthPanel } from "@/components/marketing/HeroAuthPanel";

export function CTASection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="marketing-gradient border-t border-border py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <h2 className="section-heading">Ready to share your booking link?</h2>
          <p className="section-subheading">
            Join Meetly in under a minute. Set your hours, copy your link, and start accepting
            bookings today.
          </p>
        </div>
        <HeroAuthPanel isLoggedIn={isLoggedIn} />
      </div>
      {!isLoggedIn && (
        <p className="mt-8 text-center text-sm text-muted">
          Prefer the full signup form?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Go to signup page
          </Link>
        </p>
      )}
    </section>
  );
}

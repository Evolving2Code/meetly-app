import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-navy text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-lg font-black text-navy">
            M
          </div>
          <span className="text-xl font-bold tracking-tight">Meetly</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              Open dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-primary">
              Sign in with Google
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-lime sm:mb-4 sm:text-sm">
            Bold scheduling
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Share your link.
            <br />
            Fill your calendar.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Meetly gives hosts a powerful dashboard and guests a frictionless booking
            experience — with Google sign-in and Google Calendar sync built in.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="btn-primary px-8 py-3 text-base"
            >
              {user ? "Go to dashboard" : "Get started free"}
            </Link>
            <a
              href="#features"
              className="btn-secondary border-slate-600 bg-transparent text-white hover:bg-navy-light"
            >
              See features
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-navy-light p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Host dashboard preview</span>
            <span className="badge-lime">Live</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-navy p-5">
              <p className="text-sm text-slate-400">Meetings this week</p>
              <p className="mt-2 text-4xl font-black text-lime">12</p>
            </div>
            <div className="rounded-2xl bg-navy p-5">
              <p className="text-sm text-slate-400">Booking rate</p>
              <p className="mt-2 text-4xl font-black text-white">87%</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-navy p-5">
            <p className="mb-3 text-sm font-semibold text-white">Upcoming</p>
            {["Alex — 30 min", "Jordan — Intro call", "Sam — Follow-up"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-t border-slate-700 py-3 first:border-t-0 first:pt-0"
              >
                <span className="text-sm text-slate-200">{item}</span>
                <span className="text-xs font-semibold text-lime">Confirmed</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <section id="features" className="border-t border-slate-700 bg-navy-light py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black">MVP features included</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Google login",
              "Google Calendar sync",
              "Event types & booking links",
              "Weekly availability",
              "Guest booking flow",
              "Buffer times & booking limits",
              "Timezone support",
              "Cancel bookings",
              "Host dashboard",
            ].map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-700 bg-navy p-5">
                <div className="mb-3 h-2 w-8 rounded-full bg-lime" />
                <p className="font-semibold text-white">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

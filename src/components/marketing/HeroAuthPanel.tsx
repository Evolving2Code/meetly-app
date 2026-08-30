"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon, MicrosoftIcon } from "@/components/icons/BrandIcons";

export function HeroAuthPanel({ isLoggedIn }: { isLoggedIn: boolean }) {
  async function signInWithProvider(provider: "google" | "azure") {
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
  }

  if (isLoggedIn) {
    return (
      <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-primary/5 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Welcome back</p>
        <h2 className="mt-2 text-2xl font-bold text-navy">Your dashboard is ready</h2>
        <p className="mt-2 text-sm text-muted">Manage availability, share your link, and view bookings.</p>
        <Link href="/dashboard" className="btn-primary mt-6 w-full px-8 py-3.5 text-base">
          Open dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-primary/5 sm:p-8">
      <p className="text-center text-sm font-semibold text-navy">Get started for free</p>
      <div className="mt-5 space-y-3">
        <button type="button" className="btn-oauth" onClick={() => signInWithProvider("google")}>
          <GoogleIcon />
          Sign up with Google
        </button>
        <button type="button" className="btn-oauth" onClick={() => signInWithProvider("azure")}>
          <MicrosoftIcon />
          Sign up with Microsoft
        </button>
      </div>
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <Link href="/signup" className="btn-secondary w-full py-3.5 text-base">
        Sign up with email
      </Link>
      <p className="mt-4 text-center text-xs text-muted">No credit card required</p>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

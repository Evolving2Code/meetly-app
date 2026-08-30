"use client";

import { createClient } from "@/lib/supabase/client";

export function MicrosoftSignInButton({
  label = "Continue with Microsoft",
}: {
  label?: string;
}) {
  async function signInWithMicrosoft() {
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
  }

  return (
    <button type="button" className="btn-oauth" onClick={signInWithMicrosoft}>
      <MicrosoftIcon />
      {label}
    </button>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F25022" d="M3 3h8v8H3z" />
      <path fill="#7FBA00" d="M13 3h8v8h-8z" />
      <path fill="#00A4EF" d="M3 13h8v8H3z" />
      <path fill="#FFB900" d="M13 13h8v8h-8z" />
    </svg>
  );
}

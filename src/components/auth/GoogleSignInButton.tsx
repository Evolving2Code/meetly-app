"use client";

import { createClient } from "@/lib/supabase/client";
import { GoogleIcon } from "@/components/icons/BrandIcons";

export function GoogleSignInButton({ label = "Continue with Google" }: { label?: string }) {
  async function signInWithGoogle() {
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
  }

  return (
    <button type="button" className="btn-oauth" onClick={signInWithGoogle}>
      <GoogleIcon />
      {label}
    </button>
  );
}

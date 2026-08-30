"use client";

import { createClient } from "@/lib/supabase/client";
import { MicrosoftIcon } from "@/components/icons/BrandIcons";

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

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserOnboarded, saveGoogleTokens } from "@/lib/auth/onboarding";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      await ensureUserOnboarded(data.user.id, data.user.email);

      const session = data.session;
      if (session) {
        await saveGoogleTokens(data.user.id, {
          access_token: session.provider_token,
          refresh_token: session.provider_refresh_token,
          expires_at: session.expires_at ?? null,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

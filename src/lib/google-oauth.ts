import { google } from "googleapis";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCalendarOAuthRedirectUri } from "@/lib/site-url";

const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

const STATE_COOKIE = "meetly_google_calendar_state";

export function getGoogleOAuthClient(redirectUri: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri,
  );
}

export function getCalendarRedirectUri(origin: string) {
  return getCalendarOAuthRedirectUri(origin);
}

export async function createCalendarConnectUrl(userId: string, origin: string) {
  const state = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set(STATE_COOKIE, JSON.stringify({ state, userId }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  const oauth2Client = getGoogleOAuthClient(getCalendarRedirectUri(origin));

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: CALENDAR_SCOPES,
    state,
  });
}

export async function exchangeCalendarCode(params: {
  code: string;
  state: string | null;
  origin: string;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(STATE_COOKIE)?.value;

  if (!raw || !params.state) {
    throw new Error("Missing OAuth state");
  }

  const parsed = JSON.parse(raw) as { state: string; userId: string };

  if (parsed.state !== params.state) {
    throw new Error("Invalid OAuth state");
  }

  cookieStore.delete(STATE_COOKIE);

  const oauth2Client = getGoogleOAuthClient(getCalendarRedirectUri(params.origin));
  const { tokens } = await oauth2Client.getToken(params.code);

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("google_tokens")
    .select("refresh_token")
    .eq("user_id", parsed.userId)
    .maybeSingle();

  await admin.from("google_tokens").upsert({
    user_id: parsed.userId,
    access_token: tokens.access_token ?? null,
    refresh_token: tokens.refresh_token ?? existing?.refresh_token ?? null,
    expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
    scope: tokens.scope ?? CALENDAR_SCOPES.join(" "),
    updated_at: new Date().toISOString(),
  });

  return parsed.userId;
}

export async function disconnectGoogleCalendar(userId: string) {
  const admin = createAdminClient();
  await admin.from("google_tokens").delete().eq("user_id", userId);
}

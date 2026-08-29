import { createAdminClient } from "@/lib/supabase/admin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

async function ensureUniqueUsername(base: string) {
  const admin = createAdminClient();
  let username = base || "user";
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? username : `${username}-${suffix}`;
    const { data } = await admin
      .from("profiles")
      .select("id")
      .eq("username", candidate)
      .maybeSingle();

    if (!data) {
      return candidate;
    }

    suffix += 1;
  }
}

export async function ensureUserOnboarded(userId: string, email: string) {
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (profile?.username) {
    return profile.username;
  }

  const emailPrefix = email.split("@")[0] ?? "user";
  const username = await ensureUniqueUsername(slugify(emailPrefix));

  await admin.from("profiles").update({ username }).eq("id", userId);

  const { count } = await admin
    .from("event_types")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (!count) {
    await admin.from("event_types").insert({
      user_id: userId,
      title: "30 Minute Meeting",
      slug: "30-min",
      description: "A quick 30-minute meeting.",
      duration: 30,
      buffer_before: 0,
      buffer_after: 15,
      min_notice: 120,
      max_days_ahead: 60,
      location: "Google Meet",
    });
  }

  const { count: availabilityCount } = await admin
    .from("availability_slots")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (!availabilityCount) {
    await admin.from("availability_slots").insert(
      [1, 2, 3, 4, 5].map((day_of_week) => ({
        user_id: userId,
        day_of_week,
        start_time: "09:00",
        end_time: "17:00",
      })),
    );
  }

  return username;
}

export async function saveGoogleTokens(
  userId: string,
  tokens: {
    access_token?: string | null;
    refresh_token?: string | null;
    expires_at?: number | null;
    scope?: string | null;
  },
) {
  if (!tokens.access_token && !tokens.refresh_token) {
    return;
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("google_tokens")
    .select("refresh_token")
    .eq("user_id", userId)
    .maybeSingle();

  await admin.from("google_tokens").upsert({
    user_id: userId,
    access_token: tokens.access_token ?? null,
    refresh_token: tokens.refresh_token ?? existing?.refresh_token ?? null,
    expires_at: tokens.expires_at ?? null,
    scope: tokens.scope ?? null,
    updated_at: new Date().toISOString(),
  });
}

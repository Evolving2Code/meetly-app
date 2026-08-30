import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import { normalizeUsername, validateUsername } from "@/lib/validation/username";

export async function GET() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, username, timezone, avatar_url")
    .eq("id", user!.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...profile,
    email: user!.email,
  });
}

export async function PATCH(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const updates: { timezone?: string; username?: string } = {};

  if (body.timezone !== undefined) {
    updates.timezone = String(body.timezone);
  }

  if (body.username !== undefined) {
    const usernameError = validateUsername(String(body.username));
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    updates.username = normalizeUsername(String(body.username));
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user!.id)
    .select("id, name, username, timezone, avatar_url")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...profile,
    email: user!.email,
  });
}

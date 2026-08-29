import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";

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

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      timezone: body.timezone ? String(body.timezone) : undefined,
      username: body.username ? String(body.username) : undefined,
    })
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

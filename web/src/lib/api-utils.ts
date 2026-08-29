import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, supabase, response: null };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import {
  formatContactPreferences,
  getContactPreferences,
  normalizeContactPreferencesInput,
} from "@/lib/contacts/preferences";

export async function GET() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const preferences = await getContactPreferences(supabase, user!.id);

  return NextResponse.json(formatContactPreferences(preferences));
}

export async function PATCH(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const normalized = normalizeContactPreferencesInput(body);

  if ("error" in normalized) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const { data: preferences, error } = await supabase
    .from("contact_preferences")
    .upsert(
      {
        user_id: user!.id,
        ...normalized.updates,
      },
      { onConflict: "user_id" },
    )
    .select("default_sort, auto_import_from_bookings")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(formatContactPreferences(preferences));
}

import type { SupabaseClient } from "@supabase/supabase-js";

export type ContactSort = "recent" | "name" | "meetings";

export type ContactPreferences = {
  default_sort: ContactSort;
  auto_import_from_bookings: boolean;
};

const DEFAULT_PREFERENCES: ContactPreferences = {
  default_sort: "recent",
  auto_import_from_bookings: true,
};

export async function getContactPreferences(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("contact_preferences")
    .select("default_sort, auto_import_from_bookings")
    .eq("user_id", userId)
    .maybeSingle();

  return data ?? DEFAULT_PREFERENCES;
}

export function normalizeContactPreferencesInput(body: unknown):
  | { updates: Partial<ContactPreferences> }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }

  const input = body as Record<string, unknown>;
  const updates: Partial<ContactPreferences> = {};

  if (input.defaultSort !== undefined) {
    if (!["recent", "name", "meetings"].includes(String(input.defaultSort))) {
      return { error: "Invalid default sort." };
    }

    updates.default_sort = input.defaultSort as ContactSort;
  }

  if (input.autoImportFromBookings !== undefined) {
    updates.auto_import_from_bookings = Boolean(input.autoImportFromBookings);
  }

  if (!Object.keys(updates).length) {
    return { error: "No valid fields to update." };
  }

  return { updates };
}

export function formatContactPreferences(preferences: ContactPreferences) {
  return {
    defaultSort: preferences.default_sort,
    autoImportFromBookings: preferences.auto_import_from_bookings,
  };
}

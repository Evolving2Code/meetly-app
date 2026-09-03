import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import {
  buildContactSummaries,
  filterContacts,
  sortContacts,
  type ContactBookingRow,
} from "@/lib/contacts/aggregate";

export async function GET(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const sort = request.nextUrl.searchParams.get("sort") ?? "recent";

  if (!["recent", "name", "meetings"].includes(sort)) {
    return NextResponse.json({ error: "Invalid sort parameter." }, { status: 400 });
  }

  const [{ data: bookings, error: bookingsError }, { data: notes, error: notesError }] =
    await Promise.all([
      supabase
        .from("bookings")
        .select(
          "id, guest_name, guest_email, guest_notes, start_time, end_time, timezone, status, event_types(title)",
        )
        .eq("host_id", user!.id)
        .eq("status", "confirmed")
        .order("start_time", { ascending: false }),
      supabase.from("contact_notes").select("guest_email, notes").eq("user_id", user!.id),
    ]);

  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }

  if (notesError) {
    return NextResponse.json({ error: notesError.message }, { status: 500 });
  }

  const notesByEmail = Object.fromEntries(
    (notes ?? []).map((row) => [row.guest_email.toLowerCase(), row.notes]),
  );

  const contacts = sortContacts(
    filterContacts(
      buildContactSummaries((bookings ?? []) as ContactBookingRow[], notesByEmail),
      search,
    ),
    sort as "recent" | "name" | "meetings",
  );

  return NextResponse.json(contacts);
}

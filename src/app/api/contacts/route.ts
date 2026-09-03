import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import {
  buildContactSummaries,
  filterContacts,
  mergeManualContacts,
  sortContacts,
  type ContactBookingRow,
  type ManualContactRow,
} from "@/lib/contacts/aggregate";
import { getContactPreferences } from "@/lib/contacts/preferences";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const sortParam = request.nextUrl.searchParams.get("sort");

  const preferences = await getContactPreferences(supabase, user!.id);
  const sort = sortParam ?? preferences.default_sort;

  if (!["recent", "name", "meetings"].includes(sort)) {
    return NextResponse.json({ error: "Invalid sort parameter." }, { status: 400 });
  }

  const [{ data: bookings, error: bookingsError }, { data: storedContacts, error: notesError }] =
    await Promise.all([
      preferences.auto_import_from_bookings
        ? supabase
            .from("bookings")
            .select(
              "id, guest_name, guest_email, guest_notes, start_time, end_time, timezone, status, event_types(title)",
            )
            .eq("host_id", user!.id)
            .eq("status", "confirmed")
            .order("start_time", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from("contact_notes")
        .select("guest_email, name, notes, created_at")
        .eq("user_id", user!.id),
    ]);

  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }

  if (notesError) {
    return NextResponse.json({ error: notesError.message }, { status: 500 });
  }

  const notesByEmail = Object.fromEntries(
    (storedContacts ?? []).map((row) => [row.guest_email.toLowerCase(), row.notes]),
  );

  const bookingEmails = new Set(
    (bookings ?? []).map((booking) => booking.guest_email.toLowerCase()),
  );

  const manualContacts = (storedContacts ?? []).filter(
    (row) => row.name && !bookingEmails.has(row.guest_email.toLowerCase()),
  ) as ManualContactRow[];

  const contacts = sortContacts(
    filterContacts(
      mergeManualContacts(
        buildContactSummaries((bookings ?? []) as ContactBookingRow[], notesByEmail),
        manualContacts,
      ),
      search,
    ),
    sort as "recent" | "name" | "meetings",
  );

  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("guest_email")
    .eq("host_id", user!.id)
    .ilike("guest_email", email)
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("contact_notes")
    .upsert(
      {
        user_id: user!.id,
        guest_email: existingBooking?.guest_email ?? email,
        name,
        notes: notes || null,
      },
      { onConflict: "user_id,guest_email" },
    )
    .select("guest_email, name, notes, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (existingBooking) {
    const notesByEmail = { [data.guest_email.toLowerCase()]: data.notes };
    const { data: bookings } = await supabase
      .from("bookings")
      .select(
        "id, guest_name, guest_email, guest_notes, start_time, end_time, timezone, status, event_types(title)",
      )
      .eq("host_id", user!.id)
      .ilike("guest_email", email)
      .eq("status", "confirmed");

    const contact = buildContactSummaries(
      (bookings ?? []) as ContactBookingRow[],
      notesByEmail,
    ).find((item) => item.email.toLowerCase() === data.guest_email.toLowerCase());

    return NextResponse.json(contact ?? data, { status: 201 });
  }

  return NextResponse.json(
    {
      email: data.guest_email,
      name: data.name ?? name,
      bookingCount: 0,
      firstMeeting: data.created_at,
      lastMeeting: data.created_at,
      upcomingCount: 0,
      notes: data.notes,
      isManual: true,
    },
    { status: 201 },
  );
}

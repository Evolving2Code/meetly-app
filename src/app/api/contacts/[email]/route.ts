import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import {
  buildContactSummaries,
  formatContactBooking,
  type ContactBookingRow,
} from "@/lib/contacts/aggregate";

function normalizeEmail(email: string) {
  return decodeURIComponent(email).trim().toLowerCase();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const guestEmail = normalizeEmail((await params).email);

  const [{ data: bookings, error: bookingsError }, { data: noteRow, error: notesError }] =
    await Promise.all([
      supabase
        .from("bookings")
        .select(
          "id, guest_name, guest_email, guest_notes, start_time, end_time, timezone, status, event_types(title)",
        )
        .eq("host_id", user!.id)
        .ilike("guest_email", guestEmail)
        .order("start_time", { ascending: false }),
      supabase
        .from("contact_notes")
        .select("notes")
        .eq("user_id", user!.id)
        .ilike("guest_email", guestEmail)
        .maybeSingle(),
    ]);

  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }

  if (notesError) {
    return NextResponse.json({ error: notesError.message }, { status: 500 });
  }

  if (!bookings?.length) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  const notesByEmail = { [guestEmail]: noteRow?.notes ?? null };
  const summary = buildContactSummaries(bookings as ContactBookingRow[], notesByEmail)[0];

  return NextResponse.json({
    contact: summary,
    bookings: bookings.map((booking) => formatContactBooking(booking as ContactBookingRow)),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const guestEmail = normalizeEmail((await params).email);
  const body = await request.json();
  const notes = typeof body.notes === "string" ? body.notes : "";

  const { data: booking } = await supabase
    .from("bookings")
    .select("id")
    .eq("host_id", user!.id)
    .ilike("guest_email", guestEmail)
    .limit(1)
    .maybeSingle();

  if (!booking) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  const canonicalEmail = (
    await supabase
      .from("bookings")
      .select("guest_email")
      .eq("host_id", user!.id)
      .ilike("guest_email", guestEmail)
      .order("start_time", { ascending: false })
      .limit(1)
      .maybeSingle()
  ).data?.guest_email;

  if (!canonicalEmail) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("contact_notes")
    .upsert(
      {
        user_id: user!.id,
        guest_email: canonicalEmail,
        notes: notes.trim() || null,
      },
      { onConflict: "user_id,guest_email" },
    )
    .select("notes")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notes: data.notes });
}

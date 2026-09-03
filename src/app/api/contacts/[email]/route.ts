import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import {
  buildContactSummaries,
  buildManualContactSummary,
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
        .select("guest_email, name, notes, created_at")
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

  if (!bookings?.length && !noteRow) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  const notesByEmail = { [guestEmail]: noteRow?.notes ?? null };
  const summary = bookings?.length
    ? buildContactSummaries(bookings as ContactBookingRow[], notesByEmail)[0]
    : buildManualContactSummary(noteRow!, noteRow?.notes ?? null);

  return NextResponse.json({
    contact: summary,
    bookings: (bookings ?? []).map((booking) =>
      formatContactBooking(booking as ContactBookingRow),
    ),
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
  const name = typeof body.name === "string" ? body.name.trim() : undefined;

  const { data: booking } = await supabase
    .from("bookings")
    .select("guest_email")
    .eq("host_id", user!.id)
    .ilike("guest_email", guestEmail)
    .order("start_time", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: existingNote } = await supabase
    .from("contact_notes")
    .select("guest_email, name")
    .eq("user_id", user!.id)
    .ilike("guest_email", guestEmail)
    .maybeSingle();

  if (!booking && !existingNote) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  const canonicalEmail = booking?.guest_email ?? existingNote?.guest_email ?? guestEmail;

  const { data, error } = await supabase
    .from("contact_notes")
    .upsert(
      {
        user_id: user!.id,
        guest_email: canonicalEmail,
        name: name ?? existingNote?.name ?? null,
        notes: notes.trim() || null,
      },
      { onConflict: "user_id,guest_email" },
    )
    .select("notes, name")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notes: data.notes, name: data.name });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const guestEmail = normalizeEmail((await params).email);

  const { data: booking } = await supabase
    .from("bookings")
    .select("id")
    .eq("host_id", user!.id)
    .ilike("guest_email", guestEmail)
    .limit(1)
    .maybeSingle();

  if (booking) {
    return NextResponse.json(
      { error: "Contacts with meeting history cannot be deleted." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("contact_notes")
    .delete()
    .eq("user_id", user!.id)
    .ilike("guest_email", guestEmail);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

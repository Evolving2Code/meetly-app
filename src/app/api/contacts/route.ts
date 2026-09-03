import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";

type ContactRow = {
  guest_name: string;
  guest_email: string;
  start_time: string;
};

export async function GET() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("guest_name, guest_email, start_time")
    .eq("host_id", user!.id)
    .eq("status", "confirmed")
    .order("start_time", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const contactsMap = new Map<
    string,
    { name: string; email: string; bookingCount: number; lastMeeting: string }
  >();

  for (const booking of (bookings ?? []) as ContactRow[]) {
    const email = booking.guest_email.toLowerCase();
    const existing = contactsMap.get(email);

    if (!existing) {
      contactsMap.set(email, {
        name: booking.guest_name,
        email: booking.guest_email,
        bookingCount: 1,
        lastMeeting: booking.start_time,
      });
      continue;
    }

    existing.bookingCount += 1;
    if (new Date(booking.start_time) > new Date(existing.lastMeeting)) {
      existing.name = booking.guest_name;
      existing.lastMeeting = booking.start_time;
    }
  }

  const contacts = [...contactsMap.values()].sort(
    (a, b) => new Date(b.lastMeeting).getTime() - new Date(a.lastMeeting).getTime(),
  );

  return NextResponse.json(contacts);
}

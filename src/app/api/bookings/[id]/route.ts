import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import { cancelBookingById } from "@/lib/bookings/cancel";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;

  const { data: booking } = await supabase
    .from("bookings")
    .select("id")
    .eq("id", id)
    .eq("host_id", user!.id)
    .maybeSingle();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const result = await cancelBookingById(id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}

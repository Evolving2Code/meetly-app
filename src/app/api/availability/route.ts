import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";

export async function GET() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { data: availability, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("user_id", user!.id)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(availability);
}

export async function PUT(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const slots = Array.isArray(body.slots) ? body.slots : [];

  await supabase.from("availability_slots").delete().eq("user_id", user!.id);

  if (slots.length > 0) {
    const { error: insertError } = await supabase.from("availability_slots").insert(
      slots.map((slot: { dayOfWeek: number; startTime: string; endTime: string }) => ({
        user_id: user!.id,
        day_of_week: Number(slot.dayOfWeek),
        start_time: String(slot.startTime),
        end_time: String(slot.endTime),
      })),
    );

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  const { data: availability, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("user_id", user!.id)
    .order("day_of_week", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(availability);
}

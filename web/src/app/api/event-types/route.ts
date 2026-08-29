import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";

export async function GET() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { data: eventTypes, error } = await supabase
    .from("event_types")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(eventTypes);
}

export async function POST(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const duration = Number(body.duration ?? 30);

  if (!title || !slug || Number.isNaN(duration)) {
    return NextResponse.json({ error: "Invalid event type data" }, { status: 400 });
  }

  const { data: eventType, error } = await supabase
    .from("event_types")
    .insert({
      user_id: user!.id,
      title,
      slug,
      description: body.description ? String(body.description) : null,
      duration,
      buffer_before: Number(body.bufferBefore ?? 0),
      buffer_after: Number(body.bufferAfter ?? 0),
      min_notice: Number(body.minNotice ?? 60),
      max_days_ahead: Number(body.maxDaysAhead ?? 60),
      location: body.location ? String(body.location) : null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(eventType, { status: 201 });
}

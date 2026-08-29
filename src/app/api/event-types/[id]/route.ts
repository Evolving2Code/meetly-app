import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();

  const { data: existing } = await supabase
    .from("event_types")
    .select("id")
    .eq("id", id)
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Event type not found" }, { status: 404 });
  }

  const { data: eventType, error } = await supabase
    .from("event_types")
    .update({
      title: body.title !== undefined ? String(body.title) : undefined,
      slug: body.slug !== undefined ? String(body.slug) : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      duration: body.duration !== undefined ? Number(body.duration) : undefined,
      buffer_before: body.bufferBefore !== undefined ? Number(body.bufferBefore) : undefined,
      buffer_after: body.bufferAfter !== undefined ? Number(body.bufferAfter) : undefined,
      min_notice: body.minNotice !== undefined ? Number(body.minNotice) : undefined,
      max_days_ahead: body.maxDaysAhead !== undefined ? Number(body.maxDaysAhead) : undefined,
      location: body.location !== undefined ? String(body.location) : undefined,
      active: body.active !== undefined ? Boolean(body.active) : undefined,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(eventType);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;

  const { data: existing } = await supabase
    .from("event_types")
    .select("id")
    .eq("id", id)
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Event type not found" }, { status: 404 });
  }

  const { error } = await supabase.from("event_types").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

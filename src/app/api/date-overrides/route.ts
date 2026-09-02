import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import { validateDateOverride } from "@/lib/validation/date-overrides";

function formatOverride(override: {
  id: string;
  date: string;
  available: boolean;
  start_time: string | null;
  end_time: string | null;
}) {
  return {
    id: override.id,
    date: override.date,
    available: override.available,
    startTime: override.start_time,
    endTime: override.end_time,
  };
}

export async function GET(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");

  let query = supabase
    .from("date_overrides")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: true });

  if (from) {
    query = query.gte("date", from);
  }

  if (to) {
    query = query.lte("date", to);
  }

  const { data: overrides, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((overrides ?? []).map(formatOverride));
}

export async function POST(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const date = String(body.date ?? "");
  const available = Boolean(body.available);
  const startTime = available ? String(body.startTime ?? "") : null;
  const endTime = available ? String(body.endTime ?? "") : null;

  const validationError = validateDateOverride({
    date,
    available,
    startTime,
    endTime,
  });

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { data: override, error } = await supabase
    .from("date_overrides")
    .upsert(
      {
        user_id: user!.id,
        date,
        available,
        start_time: startTime,
        end_time: endTime,
      },
      { onConflict: "user_id,date" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(formatOverride(override));
}

export async function DELETE(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const date = request.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date must use YYYY-MM-DD format." }, { status: 400 });
  }

  const { error } = await supabase
    .from("date_overrides")
    .delete()
    .eq("user_id", user!.id)
    .eq("date", date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/api-utils";
import { formatGuestBookingResponse } from "@/lib/bookings/format";
import { rescheduleBookingById } from "@/lib/bookings/reschedule";

const rescheduleSchema = z.object({
  startTime: z.string(),
  timezone: z.string(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = rescheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reschedule data" }, { status: 400 });
  }

  const startTime = new Date(parsed.data.startTime);
  const result = await rescheduleBookingById(id, user!.id, startTime, parsed.data.timezone);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(formatGuestBookingResponse(result.booking));
}

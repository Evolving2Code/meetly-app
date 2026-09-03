import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { formatGuestBookingResponse } from "@/lib/bookings/format";
import { rescheduleBookingByToken } from "@/lib/bookings/reschedule";

const rescheduleSchema = z.object({
  token: z.string().min(1),
  startTime: z.string(),
  timezone: z.string(),
});

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const parsed = rescheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reschedule data" }, { status: 400 });
  }

  const startTime = new Date(parsed.data.startTime);

  const result = await rescheduleBookingByToken(
    parsed.data.token,
    startTime,
    parsed.data.timezone,
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(formatGuestBookingResponse(result.booking));
}

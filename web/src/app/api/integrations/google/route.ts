import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import { isGoogleCalendarConnected } from "@/lib/google-calendar";

export async function GET() {
  const { session, response } = await requireAuth();
  if (response) return response;

  const connected = await isGoogleCalendarConnected(session!.user.id);

  return NextResponse.json({ connected });
}

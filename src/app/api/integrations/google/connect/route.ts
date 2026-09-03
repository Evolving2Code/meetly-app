import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import { createCalendarConnectUrl, disconnectGoogleCalendar } from "@/lib/google-oauth";
import { getSiteOrigin } from "@/lib/site-url";

export async function GET(request: Request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const origin = getSiteOrigin(new URL(request.url).origin);

  const url = await createCalendarConnectUrl(user!.id, origin);
  return NextResponse.redirect(url);
}

export async function DELETE() {
  const { user, response } = await requireAuth();
  if (response) return response;

  await disconnectGoogleCalendar(user!.id);
  return NextResponse.json({ success: true });
}

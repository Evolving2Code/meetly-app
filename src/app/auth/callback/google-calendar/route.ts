import { NextResponse } from "next/server";
import { exchangeCalendarCode } from "@/lib/google-oauth";
import { getSiteOrigin } from "@/lib/site-url";

export async function GET(request: Request) {
  const { searchParams, origin: requestOrigin } = new URL(request.url);
  const origin = getSiteOrigin(requestOrigin);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/dashboard/settings?calendar=error`);
  }

  try {
    await exchangeCalendarCode({ code, state, origin });
    return NextResponse.redirect(`${origin}/dashboard/settings?calendar=connected`);
  } catch {
    return NextResponse.redirect(`${origin}/dashboard/settings?calendar=error`);
  }
}

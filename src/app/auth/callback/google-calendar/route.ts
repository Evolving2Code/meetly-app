import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import { exchangeCalendarCode } from "@/lib/google-oauth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
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

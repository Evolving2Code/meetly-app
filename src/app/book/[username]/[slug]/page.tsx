import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookingFlow } from "@/components/booking/BookingFlow";
import {
  parseBookingDateParam,
  parseBookingTimeParam,
} from "@/lib/scheduling/booking-params";

function normalizePrefill(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const decoded = decodeURIComponent(value).trim();
  return decoded || undefined;
}

function normalizeEmail(value: string | undefined) {
  const email = normalizePrefill(value);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return undefined;
  }

  return email;
}

export default async function BookingPage({
  params,
  searchParams,
}: PageProps<"/book/[username]/[slug]"> & {
  searchParams: Promise<{ email?: string; name?: string; date?: string; time?: string }>;
}) {
  const { username, slug } = await params;
  const query = await searchParams;
  const admin = createAdminClient();

  const { data: host } = await admin
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!host) {
    notFound();
  }

  const { data: eventType } = await admin
    .from("event_types")
    .select("*")
    .eq("user_id", host.id)
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!eventType) {
    notFound();
  }

  return (
    <BookingFlow
      host={{
        name: host.name,
        username: host.username!,
        image: host.avatar_url,
        timezone: host.timezone,
      }}
      eventType={{
        title: eventType.title,
        slug: eventType.slug,
        description: eventType.description,
        duration: eventType.duration,
        location: eventType.location,
      }}
      prefilledEmail={normalizeEmail(query.email)}
      prefilledName={normalizePrefill(query.name)}
      prefilledDate={parseBookingDateParam(query.date)}
      prefilledTime={parseBookingTimeParam(query.time)}
    />
  );
}

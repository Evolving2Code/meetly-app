import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { RescheduleFlow } from "@/components/booking/RescheduleFlow";

export default async function RescheduleBookingPage({
  params,
}: PageProps<"/reschedule/[token]">) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: booking } = await admin
    .from("bookings")
    .select("*, event_types(*)")
    .eq("cancel_token", token)
    .single();

  if (!booking || booking.status === "cancelled") {
    notFound();
  }

  const { data: host } = await admin
    .from("profiles")
    .select("name, username, avatar_url, timezone")
    .eq("id", booking.host_id)
    .single();

  const eventType = booking.event_types as {
    title: string;
    slug: string;
    duration: number;
    location: string | null;
  } | null;

  if (!host?.username || !eventType) {
    notFound();
  }

  return (
    <RescheduleFlow
      cancelToken={token}
      host={{
        name: host.name,
        username: host.username,
        image: host.avatar_url,
        timezone: host.timezone,
      }}
      eventType={{
        title: eventType.title,
        slug: eventType.slug,
        duration: eventType.duration,
        location: eventType.location,
      }}
      currentStartTime={booking.start_time}
      guestTimezone={booking.timezone}
    />
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";
import { CancelBookingPanel } from "@/components/booking/CancelBookingPanel";

export default async function CancelBookingPage({
  params,
}: PageProps<"/cancel/[token]">) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: booking } = await admin
    .from("bookings")
    .select("*, event_types(title)")
    .eq("cancel_token", token)
    .single();

  if (!booking || booking.status === "cancelled") {
    notFound();
  }

  const { data: host } = await admin
    .from("profiles")
    .select("name, username")
    .eq("id", booking.host_id)
    .single();

  const eventType = booking.event_types as { title: string } | null;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <Link href="/">
          <MeetlyLogo />
        </Link>
      </header>

      <CancelBookingPanel
        eventTitle={eventType?.title ?? "Meeting"}
        hostName={host?.name ?? host?.username ?? "your host"}
        startTime={booking.start_time}
        timezone={booking.timezone}
        cancelToken={token}
      />
    </div>
  );
}

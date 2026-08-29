import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookingFlow } from "@/components/booking/BookingFlow";

export default async function BookingPage({
  params,
}: PageProps<"/book/[username]/[slug]">) {
  const { username, slug } = await params;
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
    />
  );
}

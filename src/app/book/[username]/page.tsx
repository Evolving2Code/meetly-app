import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { MeetlyIcon } from "@/components/marketing/MeetlyIcon";

export default async function HostBookingPage({
  params,
}: PageProps<"/book/[username]">) {
  const { username } = await params;
  const admin = createAdminClient();

  const { data: host } = await admin
    .from("profiles")
    .select("id, name, username, avatar_url, brand_color, timezone")
    .eq("username", username)
    .single();

  if (!host) {
    notFound();
  }

  const { data: eventTypes } = await admin
    .from("event_types")
    .select("title, slug, description, duration, location")
    .eq("user_id", host.id)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (!eventTypes?.length) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <MeetlyIcon className="h-10 w-10" />
          <div>
            <p className="text-lg font-bold text-foreground">{host.name ?? host.username}</p>
            <p className="text-sm text-muted">Choose a meeting type</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-black text-foreground">Book time with {host.name ?? host.username}</h1>
        <p className="mt-2 text-muted">
          Select an event type to see available times.
          {host.timezone ? ` Times shown in your timezone.` : null}
        </p>

        <div className="mt-8 space-y-4">
          {eventTypes.map((eventType) => (
            <Link
              key={eventType.slug}
              href={`/book/${host.username}/${eventType.slug}`}
              className="card-interactive block bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-foreground">{eventType.title}</p>
                  {eventType.description && (
                    <p className="mt-2 text-sm text-muted">{eventType.description}</p>
                  )}
                </div>
                <span className="badge-lime shrink-0">{eventType.duration} min</span>
              </div>
              {eventType.location && (
                <p className="mt-3 text-sm text-muted">{eventType.location}</p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { EventTypesManager } from "@/components/dashboard/EventTypesManager";

export default async function EventTypesPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: eventTypes }, { data: profile }] = await Promise.all([
    supabase
      .from("event_types")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase.from("profiles").select("username").eq("id", user.id).single(),
  ]);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
          Scheduling
        </p>
        <h1 className="mt-2 text-4xl font-black text-navy">Event Types</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Create booking links with custom durations, buffers, and scheduling rules.
        </p>
      </div>

      <EventTypesManager
        initialEventTypes={eventTypes ?? []}
        username={profile?.username ?? null}
      />
    </div>
  );
}

import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { AvailabilityEditor } from "@/components/dashboard/AvailabilityEditor";

export default async function AvailabilityPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: availability } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("user_id", user.id)
    .order("day_of_week", { ascending: true });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
          Scheduling
        </p>
        <h1 className="mt-2 text-4xl font-black text-navy">Availability</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Set your weekly hours. Meetly only offers slots inside these windows.
        </p>
      </div>

      <AvailabilityEditor initialSlots={availability ?? []} />
    </div>
  );
}

import { addDays, format } from "date-fns";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { AvailabilityEditor } from "@/components/dashboard/AvailabilityEditor";
import { DateOverridesEditor } from "@/components/dashboard/DateOverridesEditor";

export default async function AvailabilityPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const horizon = format(addDays(new Date(), 120), "yyyy-MM-dd");

  const [{ data: availability }, { data: overrides }] = await Promise.all([
    supabase
      .from("availability_slots")
      .select("*")
      .eq("user_id", user.id)
      .order("day_of_week", { ascending: true }),
    supabase
      .from("date_overrides")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", today)
      .lte("date", horizon)
      .order("date", { ascending: true }),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
          Scheduling
        </p>
        <h1 className="mt-1 text-3xl font-black text-navy sm:mt-2 sm:text-4xl">Availability</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Set your weekly hours and override specific dates when your schedule changes.
        </p>
      </div>

      <div className="space-y-8">
        <AvailabilityEditor initialSlots={availability ?? []} />
        <DateOverridesEditor initialOverrides={overrides ?? []} />
      </div>
    </div>
  );
}

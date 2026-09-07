import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { BookingDetailView } from "@/components/dashboard/BookingDetailView";

export default async function BookingDetailPage({
  params,
}: PageProps<"/dashboard/bookings/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: booking }, { data: profile }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*, event_types(*)")
      .eq("id", id)
      .eq("host_id", user.id)
      .maybeSingle(),
    supabase.from("profiles").select("username").eq("id", user.id).single(),
  ]);

  if (!booking) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <Link
        href="/dashboard/bookings"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to bookings
      </Link>

      <div className="mt-6">
        <BookingDetailView booking={booking} hostUsername={profile?.username ?? null} />
      </div>
    </div>
  );
}

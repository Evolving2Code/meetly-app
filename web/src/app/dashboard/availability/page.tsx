import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AvailabilityEditor } from "@/components/dashboard/AvailabilityEditor";

export default async function AvailabilityPage() {
  const session = await auth();
  const availability = await prisma.availabilitySlot.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

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

      <AvailabilityEditor initialSlots={availability} />
    </div>
  );
}

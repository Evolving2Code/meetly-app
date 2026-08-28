import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventTypesManager } from "@/components/dashboard/EventTypesManager";

export default async function EventTypesPage() {
  const session = await auth();
  const [eventTypes, user] = await Promise.all([
    prisma.eventType.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { username: true },
    }),
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
        initialEventTypes={eventTypes}
        username={user?.username ?? null}
      />
    </div>
  );
}

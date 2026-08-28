import { NextRequest, NextResponse } from "next/server";
import { addDays, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { groupSlotsByDate } from "@/lib/scheduling/format";
import { getAvailableSlots } from "@/lib/scheduling/slots";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  const slug = request.nextUrl.searchParams.get("slug");
  const timezone = request.nextUrl.searchParams.get("timezone") ?? "America/New_York";

  if (!username || !slug) {
    return NextResponse.json({ error: "Missing username or slug" }, { status: 400 });
  }

  const host = await prisma.user.findUnique({
    where: { username },
    include: {
      eventTypes: {
        where: { slug, active: true },
      },
    },
  });

  const eventType = host?.eventTypes[0];

  if (!host || !eventType) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const fromDate = startOfDay(new Date());
  const toDate = addDays(fromDate, eventType.maxDaysAhead);

  const slots = await getAvailableSlots({
    hostId: host.id,
    hostTimezone: host.timezone,
    eventType,
    fromDate,
    toDate,
  });

  const grouped = groupSlotsByDate(slots, timezone);

  return NextResponse.json({
    host: {
      name: host.name,
      username: host.username,
      timezone: host.timezone,
      image: host.image,
    },
    eventType,
    slots: grouped,
  });
}

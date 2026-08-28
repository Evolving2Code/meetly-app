import { NextRequest, NextResponse } from "next/server";
import { addMinutes, isBefore } from "date-fns";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-utils";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";
import { getAvailableSlots } from "@/lib/scheduling/slots";

const bookingSchema = z.object({
  username: z.string(),
  slug: z.string(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestNotes: z.string().optional(),
  startTime: z.string(),
  timezone: z.string(),
});

export async function GET(request: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const status = request.nextUrl.searchParams.get("status") ?? "upcoming";
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: {
      hostId: session!.user.id,
      status: "confirmed",
      ...(status === "upcoming"
        ? { startTime: { gte: now } }
        : { startTime: { lt: now } }),
    },
    include: {
      eventType: true,
    },
    orderBy: { startTime: status === "upcoming" ? "asc" : "desc" },
    take: 50,
  });

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }

  const data = parsed.data;
  const startTime = new Date(data.startTime);

  if (Number.isNaN(startTime.getTime())) {
    return NextResponse.json({ error: "Invalid start time" }, { status: 400 });
  }

  const host = await prisma.user.findUnique({
    where: { username: data.username },
    include: {
      eventTypes: {
        where: { slug: data.slug, active: true },
      },
    },
  });

  const eventType = host?.eventTypes[0];

  if (!host || !eventType) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const endTime = addMinutes(startTime, eventType.duration);

  const availableSlots = await getAvailableSlots({
    hostId: host.id,
    hostTimezone: host.timezone,
    eventType,
    fromDate: startTime,
    toDate: endTime,
  });

  const slotIsAvailable = availableSlots.some(
    (slot) => slot.start.getTime() === startTime.getTime(),
  );

  if (!slotIsAvailable) {
    return NextResponse.json({ error: "Selected time is no longer available" }, { status: 409 });
  }

  const googleEventId = await createGoogleCalendarEvent({
    userId: host.id,
    summary: `${eventType.title} with ${data.guestName}`,
    description: [
      `Guest: ${data.guestName}`,
      `Email: ${data.guestEmail}`,
      data.guestNotes ? `Notes: ${data.guestNotes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    startTime,
    endTime,
    timezone: data.timezone,
    guestEmail: data.guestEmail,
    guestName: data.guestName,
    location: eventType.location,
  });

  const booking = await prisma.booking.create({
    data: {
      eventTypeId: eventType.id,
      hostId: host.id,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestNotes: data.guestNotes,
      startTime,
      endTime,
      timezone: data.timezone,
      googleEventId,
    },
    include: {
      eventType: true,
      host: {
        select: { name: true, username: true },
      },
    },
  });

  return NextResponse.json(booking, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing cancel token" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { cancelToken: token },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status === "cancelled") {
    return NextResponse.json({ success: true });
  }

  if (isBefore(booking.startTime, new Date())) {
    return NextResponse.json({ error: "Past bookings cannot be cancelled" }, { status: 400 });
  }

  if (booking.googleEventId) {
    const { deleteGoogleCalendarEvent } = await import("@/lib/google-calendar");
    await deleteGoogleCalendarEvent(booking.hostId, booking.googleEventId);
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ success: true });
}

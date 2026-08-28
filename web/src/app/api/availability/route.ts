import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-utils";

export async function GET() {
  const { session, response } = await requireAuth();
  if (response) return response;

  const availability = await prisma.availabilitySlot.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(availability);
}

export async function PUT(request: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const slots = Array.isArray(body.slots) ? body.slots : [];

  await prisma.availabilitySlot.deleteMany({
    where: { userId: session!.user.id },
  });

  if (slots.length > 0) {
    await prisma.availabilitySlot.createMany({
      data: slots.map((slot: { dayOfWeek: number; startTime: string; endTime: string }) => ({
        userId: session!.user.id,
        dayOfWeek: Number(slot.dayOfWeek),
        startTime: String(slot.startTime),
        endTime: String(slot.endTime),
      })),
    });
  }

  const availability = await prisma.availabilitySlot.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(availability);
}

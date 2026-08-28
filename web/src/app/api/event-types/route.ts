import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-utils";

export async function GET() {
  const { session, response } = await requireAuth();
  if (response) return response;

  const eventTypes = await prisma.eventType.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(eventTypes);
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const duration = Number(body.duration ?? 30);

  if (!title || !slug || Number.isNaN(duration)) {
    return NextResponse.json({ error: "Invalid event type data" }, { status: 400 });
  }

  const eventType = await prisma.eventType.create({
    data: {
      userId: session!.user.id,
      title,
      slug,
      description: body.description ? String(body.description) : null,
      duration,
      bufferBefore: Number(body.bufferBefore ?? 0),
      bufferAfter: Number(body.bufferAfter ?? 0),
      minNotice: Number(body.minNotice ?? 60),
      maxDaysAhead: Number(body.maxDaysAhead ?? 60),
      location: body.location ? String(body.location) : null,
    },
  });

  return NextResponse.json(eventType, { status: 201 });
}

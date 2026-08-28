import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.eventType.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Event type not found" }, { status: 404 });
  }

  const eventType = await prisma.eventType.update({
    where: { id },
    data: {
      title: body.title !== undefined ? String(body.title) : undefined,
      slug: body.slug !== undefined ? String(body.slug) : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      duration: body.duration !== undefined ? Number(body.duration) : undefined,
      bufferBefore: body.bufferBefore !== undefined ? Number(body.bufferBefore) : undefined,
      bufferAfter: body.bufferAfter !== undefined ? Number(body.bufferAfter) : undefined,
      minNotice: body.minNotice !== undefined ? Number(body.minNotice) : undefined,
      maxDaysAhead: body.maxDaysAhead !== undefined ? Number(body.maxDaysAhead) : undefined,
      location: body.location !== undefined ? String(body.location) : undefined,
      active: body.active !== undefined ? Boolean(body.active) : undefined,
    },
  });

  return NextResponse.json(eventType);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;

  const existing = await prisma.eventType.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Event type not found" }, { status: 404 });
  }

  await prisma.eventType.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

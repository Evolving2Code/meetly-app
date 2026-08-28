import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-utils";

export async function GET() {
  const { session, response } = await requireAuth();
  if (response) return response;

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      timezone: true,
      image: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: session!.user.id },
    data: {
      timezone: body.timezone ? String(body.timezone) : undefined,
      username: body.username ? String(body.username) : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      timezone: true,
      image: true,
    },
  });

  return NextResponse.json(user);
}

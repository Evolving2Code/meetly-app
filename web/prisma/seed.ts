import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const host = await prisma.user.upsert({
    where: { email: "demo@meetlime.app" },
    update: {},
    create: {
      email: "demo@meetlime.app",
      name: "Alex Rivera",
      username: "alex",
      timezone: "America/New_York",
    },
  });

  await prisma.availabilitySlot.deleteMany({ where: { userId: host.id } });
  await prisma.availabilitySlot.createMany({
    data: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
      userId: host.id,
      dayOfWeek,
      startTime: "09:00",
      endTime: "17:00",
    })),
  });

  await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: host.id,
        slug: "30-min",
      },
    },
    update: {},
    create: {
      userId: host.id,
      title: "30 Minute Meeting",
      slug: "30-min",
      description: "Book a quick intro call.",
      duration: 30,
      bufferAfter: 15,
      minNotice: 60,
      maxDaysAhead: 30,
      location: "Google Meet",
    },
  });

  console.log("Seeded demo host: /book/alex/30-min");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

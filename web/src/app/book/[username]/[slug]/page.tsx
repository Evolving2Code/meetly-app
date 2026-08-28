import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingFlow } from "@/components/booking/BookingFlow";

export default async function BookingPage({
  params,
}: PageProps<"/book/[username]/[slug]">) {
  const { username, slug } = await params;

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
    notFound();
  }

  return (
    <BookingFlow
      host={{
        name: host.name,
        username: host.username!,
        image: host.image,
        timezone: host.timezone,
      }}
      eventType={{
        title: eventType.title,
        slug: eventType.slug,
        description: eventType.description,
        duration: eventType.duration,
        location: eventType.location,
      }}
    />
  );
}

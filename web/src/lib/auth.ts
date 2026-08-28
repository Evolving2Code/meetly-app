import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

async function ensureUniqueUsername(base: string) {
  let username = base || "user";
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? username : `${username}-${suffix}`;
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    suffix += 1;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true, timezone: true },
        });
        session.user.username = dbUser?.username ?? null;
        session.user.timezone = dbUser?.timezone ?? "America/New_York";
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const userId = user.id;
      if (!userId || !user.email) {
        return;
      }

      const emailPrefix = user.email.split("@")[0] ?? "user";
      const username = await ensureUniqueUsername(slugify(emailPrefix));

      await prisma.user.update({
        where: { id: userId },
        data: { username },
      });

      const defaultAvailability = [
        { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
      ];

      await prisma.availabilitySlot.createMany({
        data: defaultAvailability.map((slot) => ({
          ...slot,
          userId,
        })),
      });

      await prisma.eventType.create({
        data: {
          userId,
          title: "30 Minute Meeting",
          slug: "30-min",
          description: "A quick 30-minute meeting.",
          duration: 30,
          bufferBefore: 0,
          bufferAfter: 15,
          minNotice: 120,
          maxDaysAhead: 60,
          location: "Google Meet",
        },
      });
    },
  },
});

import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

export async function getGoogleAccount(userId: string) {
  return prisma.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });
}

export async function getGoogleCalendarClient(userId: string) {
  const account = await getGoogleAccount(userId);

  if (!account?.access_token) {
    return null;
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token ?? undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  auth.on("tokens", async (tokens) => {
    if (!tokens.access_token) {
      return;
    }

    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: tokens.access_token,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : account.expires_at,
        refresh_token: tokens.refresh_token ?? account.refresh_token,
      },
    });
  });

  return google.calendar({ version: "v3", auth });
}

export async function getBusyIntervals(
  userId: string,
  timeMin: Date,
  timeMax: Date,
): Promise<Array<{ start: Date; end: Date }>> {
  const calendar = await getGoogleCalendarClient(userId);

  if (!calendar) {
    return [];
  }

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: "primary" }],
      },
    });

    const busy = response.data.calendars?.primary?.busy ?? [];

    return busy
      .filter((interval) => interval.start && interval.end)
      .map((interval) => ({
        start: new Date(interval.start!),
        end: new Date(interval.end!),
      }));
  } catch (error) {
    console.error("Failed to fetch Google Calendar busy times:", error);
    return [];
  }
}

export async function createGoogleCalendarEvent(params: {
  userId: string;
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  guestEmail: string;
  guestName: string;
  location?: string | null;
}) {
  const calendar = await getGoogleCalendarClient(params.userId);

  if (!calendar) {
    return null;
  }

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary: params.summary,
        description: params.description,
        location: params.location ?? undefined,
        start: {
          dateTime: params.startTime.toISOString(),
          timeZone: params.timezone,
        },
        end: {
          dateTime: params.endTime.toISOString(),
          timeZone: params.timezone,
        },
        attendees: [{ email: params.guestEmail, displayName: params.guestName }],
        conferenceData: {
          createRequest: {
            requestId: `${params.userId}-${params.startTime.getTime()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    return response.data.id ?? null;
  } catch (error) {
    console.error("Failed to create Google Calendar event:", error);
    return null;
  }
}

export async function deleteGoogleCalendarEvent(
  userId: string,
  googleEventId: string,
) {
  const calendar = await getGoogleCalendarClient(userId);

  if (!calendar) {
    return;
  }

  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId: googleEventId,
      sendUpdates: "all",
    });
  } catch (error) {
    console.error("Failed to delete Google Calendar event:", error);
  }
}

export async function isGoogleCalendarConnected(userId: string) {
  const account = await getGoogleAccount(userId);
  return Boolean(account?.access_token);
}

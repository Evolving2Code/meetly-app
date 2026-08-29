import { google } from "googleapis";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getGoogleTokens(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("google_tokens")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
}

export async function getGoogleCalendarClient(userId: string) {
  const tokens = await getGoogleTokens(userId);

  if (!tokens?.access_token && !tokens?.refresh_token) {
    return null;
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  auth.setCredentials({
    access_token: tokens.access_token ?? undefined,
    refresh_token: tokens.refresh_token ?? undefined,
    expiry_date: tokens.expires_at ? tokens.expires_at * 1000 : undefined,
  });

  auth.on("tokens", async (newTokens) => {
    if (!newTokens.access_token) {
      return;
    }

    const admin = createAdminClient();
    await admin
      .from("google_tokens")
      .update({
        access_token: newTokens.access_token,
        expires_at: newTokens.expiry_date
          ? Math.floor(newTokens.expiry_date / 1000)
          : tokens.expires_at,
        refresh_token: newTokens.refresh_token ?? tokens.refresh_token,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
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
  const tokens = await getGoogleTokens(userId);
  return Boolean(tokens?.refresh_token || tokens?.access_token);
}

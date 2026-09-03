import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { sendEmail } from "@/lib/email/send";
import type { NotificationPreferences } from "@/lib/supabase/types";

type BookingEmailContext = {
  hostName: string;
  hostEmail: string;
  guestName: string;
  guestEmail: string;
  eventTitle: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  guestNotes?: string | null;
  cancelUrl: string;
  rescheduleUrl: string;
};

function formatBookingWhen(startTime: Date, timezone: string) {
  return formatInTimeZone(startTime, timezone, "EEEE, MMMM d, yyyy 'at' h:mm a zzz");
}

export async function sendHostNewBookingEmail(
  context: BookingEmailContext,
): Promise<{ sent: boolean; error?: string }> {
  const when = formatBookingWhen(context.startTime, context.timezone);

  return sendEmail({
    to: context.hostEmail,
    subject: `New booking: ${context.eventTitle} with ${context.guestName}`,
    text: [
      `Hi ${context.hostName},`,
      "",
      `${context.guestName} booked ${context.eventTitle}.`,
      `When: ${when}`,
      `Guest email: ${context.guestEmail}`,
      context.guestNotes ? `Notes: ${context.guestNotes}` : null,
      "",
      "— Meetly",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <p>Hi ${context.hostName},</p>
      <p><strong>${context.guestName}</strong> booked <strong>${context.eventTitle}</strong>.</p>
      <p><strong>When:</strong> ${when}<br />
      <strong>Guest email:</strong> ${context.guestEmail}</p>
      ${context.guestNotes ? `<p><strong>Notes:</strong> ${context.guestNotes}</p>` : ""}
      <p>— Meetly</p>
    `,
  });
}

export async function sendGuestConfirmationEmail(
  context: BookingEmailContext,
): Promise<{ sent: boolean; error?: string }> {
  const when = formatBookingWhen(context.startTime, context.timezone);

  return sendEmail({
    to: context.guestEmail,
    subject: `Confirmed: ${context.eventTitle} with ${context.hostName}`,
    text: [
      `Hi ${context.guestName},`,
      "",
      `Your meeting with ${context.hostName} is confirmed.`,
      `Event: ${context.eventTitle}`,
      `When: ${when}`,
      `Reschedule: ${context.rescheduleUrl}`,
      `Cancel: ${context.cancelUrl}`,
      "",
      "— Meetly",
    ].join("\n"),
    html: `
      <p>Hi ${context.guestName},</p>
      <p>Your meeting with <strong>${context.hostName}</strong> is confirmed.</p>
      <p><strong>Event:</strong> ${context.eventTitle}<br />
      <strong>When:</strong> ${when}</p>
      <p><a href="${context.rescheduleUrl}">Reschedule this booking</a> · <a href="${context.cancelUrl}">Cancel</a></p>
      <p>— Meetly</p>
    `,
  });
}

export async function sendBookingReminderEmail(params: {
  recipientName: string;
  recipientEmail: string;
  counterpartName: string;
  eventTitle: string;
  startTime: Date;
  timezone: string;
  cancelUrl?: string;
  audience: "host" | "guest";
}): Promise<{ sent: boolean; error?: string }> {
  const when = formatBookingWhen(params.startTime, params.timezone);
  const subject =
    params.audience === "host"
      ? `Reminder: ${params.eventTitle} with ${params.counterpartName}`
      : `Reminder: ${params.eventTitle} with ${params.counterpartName}`;

  const intro =
    params.audience === "host"
      ? `This is a reminder that ${params.counterpartName} is meeting with you soon.`
      : `This is a reminder about your upcoming meeting with ${params.counterpartName}.`;

  return sendEmail({
    to: params.recipientEmail,
    subject,
    text: [
      `Hi ${params.recipientName},`,
      "",
      intro,
      `Event: ${params.eventTitle}`,
      `When: ${when}`,
      params.cancelUrl ? `Cancel: ${params.cancelUrl}` : null,
      "",
      "— Meetly",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <p>Hi ${params.recipientName},</p>
      <p>${intro}</p>
      <p><strong>Event:</strong> ${params.eventTitle}<br />
      <strong>When:</strong> ${when}</p>
      ${params.cancelUrl ? `<p><a href="${params.cancelUrl}">Cancel this booking</a></p>` : ""}
      <p>— Meetly</p>
    `,
  });
}

export function buildCancelUrl(siteUrl: string, cancelToken: string) {
  return `${siteUrl.replace(/\/$/, "")}/cancel/${cancelToken}`;
}

export function buildRescheduleUrl(siteUrl: string, cancelToken: string) {
  return `${siteUrl.replace(/\/$/, "")}/reschedule/${cancelToken}`;
}

export function defaultNotificationPreferences(
  userId: string,
): NotificationPreferences {
  return {
    user_id: userId,
    email_on_new_booking: true,
    email_guest_confirmation: true,
    email_booking_reminder: true,
    reminder_hours_before: 24,
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  };
}

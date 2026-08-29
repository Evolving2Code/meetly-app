import {
  addDays,
  addMinutes,
  endOfDay,
  format,
  isAfter,
  isBefore,
  parse,
  startOfDay,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBusyIntervals } from "@/lib/google-calendar";
import type { Booking, DateOverride, EventType } from "@/lib/supabase/types";

type EventTypeConfig = Pick<
  EventType,
  "duration" | "buffer_before" | "buffer_after" | "min_notice" | "max_days_ahead"
>;

type AvailabilityRow = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

function parseTimeOnDate(date: Date, time: string, timezone: string) {
  const dateKey = format(date, "yyyy-MM-dd");
  return fromZonedTime(parse(`${dateKey} ${time}`, "yyyy-MM-dd HH:mm", new Date()), timezone);
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

export async function getAvailableSlots(params: {
  hostId: string;
  hostTimezone: string;
  eventType: EventTypeConfig;
  fromDate: Date;
  toDate: Date;
}) {
  const { hostId, hostTimezone, eventType, fromDate, toDate } = params;
  const admin = createAdminClient();
  const now = new Date();
  const minBookingTime = addMinutes(now, eventType.min_notice);
  const maxBookingDate = addDays(now, eventType.max_days_ahead);

  const [{ data: availability }, { data: overrides }, { data: bookings }] =
    await Promise.all([
      admin.from("availability_slots").select("*").eq("user_id", hostId),
      admin
        .from("date_overrides")
        .select("*")
        .eq("user_id", hostId)
        .gte("date", format(startOfDay(fromDate), "yyyy-MM-dd"))
        .lte("date", format(startOfDay(toDate), "yyyy-MM-dd")),
      admin
        .from("bookings")
        .select("*")
        .eq("host_id", hostId)
        .eq("status", "confirmed")
        .lt("start_time", toDate.toISOString())
        .gt("end_time", fromDate.toISOString()),
    ]);

  const busyIntervals = await getBusyIntervals(hostId, fromDate, toDate);

  const slots: Array<{ start: Date; end: Date }> = [];
  let cursor = startOfDay(fromDate);

  while (cursor <= toDate) {
    const hostDate = toZonedTime(cursor, hostTimezone);
    const dayOfWeek = hostDate.getDay();
    const dateKey = format(hostDate, "yyyy-MM-dd");

    const override = (overrides as DateOverride[] | null)?.find(
      (item) => item.date === dateKey,
    );

    const windows = override
      ? override.available && override.start_time && override.end_time
        ? [
            {
              start: parseTimeOnDate(hostDate, override.start_time, hostTimezone),
              end: parseTimeOnDate(hostDate, override.end_time, hostTimezone),
            },
          ]
        : []
      : ((availability as AvailabilityRow[] | null) ?? [])
          .filter((slot) => slot.day_of_week === dayOfWeek)
          .map((slot) => ({
            start: parseTimeOnDate(hostDate, slot.start_time, hostTimezone),
            end: parseTimeOnDate(hostDate, slot.end_time, hostTimezone),
          }));

    for (const window of windows) {
      let slotStart = window.start;

      while (true) {
        const meetingStart = addMinutes(slotStart, eventType.buffer_before);
        const meetingEnd = addMinutes(meetingStart, eventType.duration);
        const slotEnd = addMinutes(meetingEnd, eventType.buffer_after);

        if (slotEnd > window.end) {
          break;
        }

        const isWithinRange =
          !isBefore(meetingStart, fromDate) &&
          !isAfter(meetingStart, toDate) &&
          !isAfter(meetingStart, maxBookingDate);

        const meetsNotice = !isBefore(meetingStart, minBookingTime);

        if (isWithinRange && meetsNotice) {
          const confirmedBookings = (bookings as Booking[] | null) ?? [];
          const hasConflict =
            confirmedBookings.some((booking) =>
              overlaps(
                meetingStart,
                meetingEnd,
                new Date(booking.start_time),
                new Date(booking.end_time),
              ),
            ) ||
            busyIntervals.some((busy) =>
              overlaps(meetingStart, meetingEnd, busy.start, busy.end),
            );

          if (!hasConflict) {
            slots.push({ start: meetingStart, end: meetingEnd });
          }
        }

        slotStart = addMinutes(slotStart, eventType.duration + eventType.buffer_after);
      }
    }

    cursor = addDays(cursor, 1);
  }

  return slots;
}

export async function isSlotAvailable(params: {
  hostId: string;
  hostTimezone: string;
  eventType: EventTypeConfig;
  startTime: Date;
}) {
  const { startTime } = params;
  const slots = await getAvailableSlots({
    ...params,
    fromDate: startOfDay(startTime),
    toDate: endOfDay(startTime),
  });

  return slots.some((slot) => slot.start.getTime() === startTime.getTime());
}

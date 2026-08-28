import {
  addDays,
  addMinutes,
  format,
  isAfter,
  isBefore,
  parse,
  startOfDay,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import { getBusyIntervals } from "@/lib/google-calendar";

type EventTypeConfig = {
  duration: number;
  bufferBefore: number;
  bufferAfter: number;
  minNotice: number;
  maxDaysAhead: number;
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
  const now = new Date();
  const minBookingTime = addMinutes(now, eventType.minNotice);
  const maxBookingDate = addDays(now, eventType.maxDaysAhead);

  const [availability, overrides, bookings, busyIntervals] = await Promise.all([
    prisma.availabilitySlot.findMany({
      where: { userId: hostId },
    }),
    prisma.dateOverride.findMany({
      where: {
        userId: hostId,
        date: {
          gte: startOfDay(fromDate),
          lte: startOfDay(toDate),
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        hostId,
        status: "confirmed",
        startTime: { lt: toDate },
        endTime: { gt: fromDate },
      },
    }),
    getBusyIntervals(hostId, fromDate, toDate),
  ]);

  const slots: Array<{ start: Date; end: Date }> = [];
  let cursor = startOfDay(fromDate);

  while (cursor <= toDate) {
    const hostDate = toZonedTime(cursor, hostTimezone);
    const dayOfWeek = hostDate.getDay();
    const dateKey = format(hostDate, "yyyy-MM-dd");

    const override = overrides.find(
      (item) => format(toZonedTime(item.date, hostTimezone), "yyyy-MM-dd") === dateKey,
    );

    const windows = override
      ? override.available && override.startTime && override.endTime
        ? [
            {
              start: parseTimeOnDate(hostDate, override.startTime, hostTimezone),
              end: parseTimeOnDate(hostDate, override.endTime, hostTimezone),
            },
          ]
        : []
      : availability
          .filter((slot) => slot.dayOfWeek === dayOfWeek)
          .map((slot) => ({
            start: parseTimeOnDate(hostDate, slot.startTime, hostTimezone),
            end: parseTimeOnDate(hostDate, slot.endTime, hostTimezone),
          }));

    for (const window of windows) {
      let slotStart = window.start;

      while (true) {
        const meetingStart = addMinutes(slotStart, eventType.bufferBefore);
        const meetingEnd = addMinutes(meetingStart, eventType.duration);
        const slotEnd = addMinutes(meetingEnd, eventType.bufferAfter);

        if (slotEnd > window.end) {
          break;
        }

        const isWithinRange =
          !isBefore(meetingStart, fromDate) &&
          !isAfter(meetingStart, toDate) &&
          !isAfter(meetingStart, maxBookingDate);

        const meetsNotice = !isBefore(meetingStart, minBookingTime);

        if (isWithinRange && meetsNotice) {
          const hasConflict =
            bookings.some((booking) =>
              overlaps(meetingStart, meetingEnd, booking.startTime, booking.endTime),
            ) ||
            busyIntervals.some((busy) =>
              overlaps(meetingStart, meetingEnd, busy.start, busy.end),
            );

          if (!hasConflict) {
            slots.push({ start: meetingStart, end: meetingEnd });
          }
        }

        slotStart = addMinutes(slotStart, eventType.duration + eventType.bufferAfter);
      }
    }

    cursor = addDays(cursor, 1);
  }

  return slots;
}

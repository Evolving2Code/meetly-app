import { format, parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function groupSlotsByDate(
  slots: Array<{ start: Date; end: Date }>,
  timezone: string,
) {
  return slots.reduce<Record<string, Array<{ start: Date; end: Date }>>>((acc, slot) => {
    const key = format(toZonedTime(slot.start, timezone), "yyyy-MM-dd");
    acc[key] = acc[key] ?? [];
    acc[key].push(slot);
    return acc;
  }, {});
}

export function formatSlotLabel(date: Date, timezone: string) {
  return format(toZonedTime(date, timezone), "h:mm a");
}

export function formatDateLabel(date: Date, timezone: string) {
  return format(toZonedTime(date, timezone), "EEEE, MMMM d");
}

export function parseDateKey(dateKey: string, timezone: string) {
  return fromZonedTime(parse(`${dateKey} 12:00`, "yyyy-MM-dd HH:mm", new Date()), timezone);
}

export function formatDateKeyLabel(dateKey: string, timezone: string) {
  return formatDateLabel(parseDateKey(dateKey, timezone), timezone);
}

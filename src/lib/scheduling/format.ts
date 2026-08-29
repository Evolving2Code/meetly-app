import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

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

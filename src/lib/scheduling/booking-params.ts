import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function findSlotByDateAndTime(
  slotsByDate: Record<string, Array<{ start: string; end: string }>>,
  dateKey: string,
  timeValue: string,
  timezone: string,
) {
  const daySlots = slotsByDate[dateKey];
  if (!daySlots?.length) {
    return null;
  }

  const normalizedTime = timeValue.trim();

  return (
    daySlots.find((slot) => {
      const slotTime = format(toZonedTime(new Date(slot.start), timezone), "HH:mm");
      return slotTime === normalizedTime;
    }) ?? null
  );
}

export function parseBookingDateParam(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  return value;
}

export function parseBookingTimeParam(value: string | undefined) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return undefined;
  }

  return value;
}

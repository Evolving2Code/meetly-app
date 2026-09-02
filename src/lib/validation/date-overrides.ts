const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export type DateOverrideInput = {
  date: string;
  available: boolean;
  startTime?: string | null;
  endTime?: string | null;
};

export function validateDateOverride(input: DateOverrideInput): string | null {
  if (!DATE_PATTERN.test(input.date)) {
    return "Date must use YYYY-MM-DD format.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overrideDate = new Date(`${input.date}T00:00:00`);

  if (Number.isNaN(overrideDate.getTime())) {
    return "Invalid date.";
  }

  if (overrideDate < today) {
    return "Date overrides must be today or in the future.";
  }

  if (!input.available) {
    return null;
  }

  const startTime = input.startTime ?? "";
  const endTime = input.endTime ?? "";

  if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) {
    return "Available overrides require valid start and end times.";
  }

  if (startTime >= endTime) {
    return "End time must be after start time.";
  }

  return null;
}

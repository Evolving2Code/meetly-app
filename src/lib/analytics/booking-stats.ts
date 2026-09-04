import { format, startOfDay, subDays } from "date-fns";

export type BookingTrendPoint = {
  label: string;
  date: string;
  count: number;
};

export type EventTypeBreakdown = {
  title: string;
  count: number;
};

export function buildBookingTrend(
  bookings: Array<{ created_at: string }>,
  days = 14,
): BookingTrendPoint[] {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const day = subDays(today, days - index - 1);
    const dayKey = format(day, "yyyy-MM-dd");
    const count = bookings.filter(
      (booking) => format(startOfDay(new Date(booking.created_at)), "yyyy-MM-dd") === dayKey,
    ).length;

    return {
      label: format(day, "MMM d"),
      date: dayKey,
      count,
    };
  });
}

export function buildEventTypeBreakdown(
  bookings: Array<{ event_types: { title: string } | null }>,
): EventTypeBreakdown[] {
  const counts = new Map<string, number>();

  for (const booking of bookings) {
    const title = booking.event_types?.title ?? "Unknown";
    counts.set(title, (counts.get(title) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([title, count]) => ({ title, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);
}

"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useMemo, useState } from "react";

type BookingDateCalendarProps = {
  availableDates: string[];
  timezone: string;
  selectedDate: string | null;
  initialMonth?: string | null;
  onSelectDate: (dateKey: string) => void;
};

export function BookingDateCalendar({
  availableDates,
  timezone,
  selectedDate,
  initialMonth,
  onSelectDate,
}: BookingDateCalendarProps) {
  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);
  const initialVisibleMonth = initialMonth
    ? startOfMonth(parseISO(initialMonth))
    : availableDates[0]
      ? startOfMonth(parseISO(availableDates[0]))
      : startOfMonth(new Date());
  const [visibleMonth, setVisibleMonth] = useState(initialVisibleMonth);

  useEffect(() => {
    if (initialMonth) {
      setVisibleMonth(startOfMonth(parseISO(initialMonth)));
    }
  }, [initialMonth]);

  const days = useMemo(() => {
    const zonedMonth = toZonedTime(visibleMonth, timezone);
    const monthStart = startOfMonth(zonedMonth);
    const monthEnd = endOfMonth(zonedMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [visibleMonth, timezone]);

  const visibleMonthLabel = format(toZonedTime(visibleMonth, timezone), "MMMM yyyy");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="btn-secondary min-h-[44px] px-4"
          onClick={() => setVisibleMonth((current) => subMonths(current, 1))}
        >
          ←
        </button>
        <p className="text-sm font-bold text-navy">{visibleMonthLabel}</p>
        <button
          type="button"
          className="btn-secondary min-h-[44px] px-4"
          onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <div key={label} className="py-1 text-center text-xs font-semibold text-muted">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const zonedVisibleMonth = toZonedTime(visibleMonth, timezone);
          const inMonth = isSameMonth(day, zonedVisibleMonth);
          const isAvailable = availableSet.has(dateKey);
          const isToday = isSameDay(day, toZonedTime(new Date(), timezone));
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectDate(dateKey)}
              className={`aspect-square rounded-xl border text-sm font-bold transition ${
                isSelected
                  ? "border-lime bg-lime text-navy"
                  : isAvailable
                    ? "border-border bg-white text-navy hover:border-lime hover:bg-lime/10"
                    : "cursor-not-allowed border-transparent bg-surface text-muted/50"
              } ${inMonth ? "" : "opacity-40"} ${isToday && !isSelected ? "ring-2 ring-primary/30" : ""}`}
            >
              <span>{format(day, "d")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

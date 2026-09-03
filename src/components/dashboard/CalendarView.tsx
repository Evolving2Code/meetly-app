"use client";

import { startOfMonth, startOfWeek } from "date-fns";
import { useState } from "react";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarWeekView } from "./CalendarWeekView";

type ViewMode = "week" | "month";

export function CalendarView() {
  const [view, setView] = useState<ViewMode>("week");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <ViewButton active={view === "week"} onClick={() => setView("week")}>
          Week
        </ViewButton>
        <ViewButton active={view === "month"} onClick={() => setView("month")}>
          Month
        </ViewButton>
      </div>

      {view === "week" ? (
        <CalendarWeekView weekStart={weekStart} onWeekStartChange={setWeekStart} />
      ) : (
        <CalendarMonthView monthStart={monthStart} onMonthStartChange={setMonthStart} />
      )}
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-navy text-white" : "bg-surface text-muted hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

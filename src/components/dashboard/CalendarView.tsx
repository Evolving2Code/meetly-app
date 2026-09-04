"use client";

import { startOfMonth, startOfWeek } from "date-fns";
import { useState } from "react";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarWeekView } from "./CalendarWeekView";
import { TabFilter } from "@/components/ui/TabFilter";

type ViewMode = "week" | "month";

export function CalendarView() {
  const [view, setView] = useState<ViewMode>("week");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));

  return (
    <div className="space-y-6">
      <TabFilter
        items={[
          { id: "week", label: "Week" },
          { id: "month", label: "Month" },
        ]}
        activeId={view}
        onChange={(id) => setView(id as ViewMode)}
      />

      {view === "week" ? (
        <CalendarWeekView weekStart={weekStart} onWeekStartChange={setWeekStart} />
      ) : (
        <CalendarMonthView monthStart={monthStart} onMonthStartChange={setMonthStart} />
      )}
    </div>
  );
}

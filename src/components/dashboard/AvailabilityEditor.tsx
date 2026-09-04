"use client";

import { useMemo, useState } from "react";
import { DAY_NAMES } from "@/lib/scheduling/constants";
import type { AvailabilitySlot } from "@/lib/supabase/types";

const defaultSlots: Array<Pick<AvailabilitySlot, "day_of_week" | "start_time" | "end_time">> =
  [1, 2, 3, 4, 5].map((day_of_week) => ({
    day_of_week,
    start_time: "09:00",
    end_time: "17:00",
  }));

export function AvailabilityEditor({
  initialSlots,
}: {
  initialSlots: AvailabilitySlot[];
}) {
  const [slots, setSlots] = useState(
    initialSlots.length > 0
      ? initialSlots.map(({ day_of_week, start_time, end_time }) => ({
          dayOfWeek: day_of_week,
          startTime: start_time,
          endTime: end_time,
        }))
      : defaultSlots.map((slot) => ({
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
        })),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const slotsByDay = useMemo(() => {
    return DAY_NAMES.map((_, dayOfWeek) =>
      slots.filter((slot) => slot.dayOfWeek === dayOfWeek),
    );
  }, [slots]);

  function updateSlot(index: number, field: "startTime" | "endTime", value: string) {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot,
      ),
    );
  }

  function toggleDay(dayOfWeek: number) {
    setSlots((current) => {
      const hasDay = current.some((slot) => slot.dayOfWeek === dayOfWeek);
      if (hasDay) {
        return current.filter((slot) => slot.dayOfWeek !== dayOfWeek);
      }

      return [
        ...current,
        { dayOfWeek, startTime: "09:00", endTime: "17:00" },
      ].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    });
  }

  async function saveAvailability() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    });

    setLoading(false);

    if (!response.ok) {
      setMessage("Could not save availability.");
      return;
    }

    const saved = await response.json();
    setSlots(
      saved.map((slot: AvailabilitySlot) => ({
        dayOfWeek: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
      })),
    );
    setMessage("Availability saved.");
  }

  return (
    <div className="card max-w-4xl">
      <div className="space-y-4">
        {DAY_NAMES.map((dayName, dayOfWeek) => {
          const daySlots = slotsByDay[dayOfWeek];
          const enabled = daySlots.length > 0;

          return (
            <div
              key={dayName}
              className="grid gap-4 rounded-2xl border border-border bg-surface p-4 md:grid-cols-[140px_1fr_auto]"
            >
              <button
                type="button"
                onClick={() => toggleDay(dayOfWeek)}
                className={`rounded-xl px-4 py-3 text-left text-sm font-bold ${
                  enabled ? "bg-lime text-navy" : "bg-background text-muted"
                }`}
              >
                {dayName}
              </button>

              {enabled ? (
                daySlots.map((slot) => {
                  const index = slots.findIndex(
                    (item) =>
                      item.dayOfWeek === slot.dayOfWeek &&
                      item.startTime === slot.startTime &&
                      item.endTime === slot.endTime,
                  );

                  return (
                    <div key={`${dayName}-${slot.startTime}`} className="flex flex-wrap items-center gap-3">
                      <input
                        type="time"
                        className="input w-auto"
                        value={slot.startTime}
                        onChange={(event) =>
                          updateSlot(index, "startTime", event.target.value)
                        }
                      />
                      <span className="text-sm text-muted">to</span>
                      <input
                        type="time"
                        className="input w-auto"
                        value={slot.endTime}
                        onChange={(event) =>
                          updateSlot(index, "endTime", event.target.value)
                        }
                      />
                    </div>
                  );
                })
              ) : (
                <p className="self-center text-sm text-muted">Unavailable</p>
              )}

              <span className={`self-center badge ${enabled ? "badge-lime" : "bg-slate-200 text-slate-600"}`}>
                {enabled ? "Open" : "Closed"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button type="button" className="btn-primary" disabled={loading} onClick={saveAvailability}>
          {loading ? "Saving..." : "Save availability"}
        </button>
        {message && <p className="text-sm font-medium text-lime-dark">{message}</p>}
      </div>
    </div>
  );
}

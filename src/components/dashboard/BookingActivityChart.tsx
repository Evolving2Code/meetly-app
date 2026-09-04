import type { BookingTrendPoint, EventTypeBreakdown } from "@/lib/analytics/booking-stats";

export function BookingActivityChart({
  trend,
  breakdown,
}: {
  trend: BookingTrendPoint[];
  breakdown: EventTypeBreakdown[];
}) {
  const maxCount = Math.max(...trend.map((point) => point.count), 1);
  const totalBookings = trend.reduce((sum, point) => sum + point.count, 0);

  return (
    <section className="card">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Booking activity</h2>
          <p className="mt-1 text-sm text-muted">Confirmed bookings over the last 14 days.</p>
        </div>
        <span className="badge-lime">{totalBookings} total</span>
      </div>

      {totalBookings === 0 ? (
        <div className="rounded-2xl bg-surface px-6 py-10 text-center">
          <p className="font-semibold text-navy">No bookings yet</p>
          <p className="mt-2 text-sm text-muted">Share your booking link to start tracking activity.</p>
        </div>
      ) : (
        <>
          <div className="flex h-44 items-end gap-2 sm:gap-3">
            {trend.map((point) => (
              <div key={point.date} className="group flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-xl bg-lime transition-all duration-300 group-hover:bg-lime-dark"
                    style={{
                      height: `${Math.max(point.count > 0 ? 12 : 4, (point.count / maxCount) * 100)}%`,
                    }}
                    title={`${point.count} booking${point.count === 1 ? "" : "s"}`}
                  />
                </div>
                <span className="truncate text-[10px] font-semibold text-muted sm:text-xs">
                  {point.label}
                </span>
              </div>
            ))}
          </div>

          {breakdown.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-sm font-semibold text-navy">By event type</p>
              <div className="mt-4 space-y-3">
                {breakdown.map((item) => {
                  const width = Math.max(8, (item.count / maxCount) * 100);

                  return (
                    <div key={item.title}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-navy">{item.title}</span>
                        <span className="font-semibold text-muted">{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

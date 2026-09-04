import type { ReactNode } from "react";

type ScreenshotFrameProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

function ScreenshotFrame({ title, children, className = "" }: ScreenshotFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-white shadow-lg ${className}`}
      role="img"
      aria-label={title}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-lime" />
        <span className="ml-2 text-xs font-medium text-muted">meetly.app</span>
      </div>
      {children}
    </div>
  );
}

export function HeroBookingScreenshot() {
  return (
    <ScreenshotFrame title="Meetly booking page preview">
      <div className="grid min-h-[220px] grid-cols-[38%_1fr] sm:min-h-[260px]">
        <div className="bg-navy p-4 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-xs font-black text-navy">
              A
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Book with</p>
              <p className="text-sm font-bold">Alex Rivera</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Meeting</p>
            <p className="text-xs font-bold">30 Min Intro</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Duration</p>
            <p className="text-xs font-bold">30 min</p>
          </div>
          <div className="mt-4 rounded-xl bg-navy-light p-2">
            <div className="grid grid-cols-4 gap-1">
              {["Date", "Time", "Info", "Done"].map((label, index) => (
                <div key={label} className="text-center">
                  <div
                    className={`mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                      index < 2 ? "bg-lime text-navy" : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-[8px] text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-4">
          <p className="text-xs font-black text-navy">Select a date</p>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md ${
                  index === 16
                    ? "bg-lime"
                    : index % 7 === 0 || index % 7 === 6
                      ? "bg-surface"
                      : index > 6
                        ? "bg-surface-muted"
                        : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {["9:00 AM", "10:30 AM", "2:00 PM"].map((time, index) => (
              <div
                key={time}
                className={`rounded-md border px-1 py-1.5 text-center text-[9px] font-bold ${
                  index === 1 ? "border-lime bg-lime text-navy" : "border-border text-navy"
                }`}
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenshotFrame>
  );
}

export function SignupScreenshot() {
  return (
    <ScreenshotFrame title="Create your Meetly account">
      <div className="space-y-3 p-5">
        <p className="text-sm font-black text-navy">Create your account</p>
        <div className="h-9 rounded-xl bg-surface-muted" />
        <div className="h-9 rounded-xl bg-surface-muted" />
        <div className="h-10 rounded-full bg-primary" />
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-full border border-border" />
          <div className="h-9 rounded-full border border-border" />
        </div>
      </div>
    </ScreenshotFrame>
  );
}

export function AvailabilityScreenshot() {
  return (
    <ScreenshotFrame title="Set your weekly availability">
      <div className="p-5">
        <p className="text-sm font-black text-navy">Weekly hours</p>
        <div className="mt-4 space-y-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-8 text-xs font-semibold text-muted">{day}</span>
              <div
                className="h-6 flex-1 rounded-lg bg-lime/20"
                style={{ opacity: 1 - index * 0.05 }}
              />
              <span className="text-[10px] font-semibold text-navy">9–5</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-3">
          <p className="text-[10px] font-semibold text-muted">Booking link</p>
          <p className="mt-1 truncate text-xs font-bold text-primary">meetly.app/book/alex/intro</p>
        </div>
      </div>
    </ScreenshotFrame>
  );
}

export function ConfirmationScreenshot() {
  return (
    <ScreenshotFrame title="Guest booking confirmation">
      <div className="p-5">
        <div className="rounded-2xl bg-lime/10 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-navy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-lime-dark">Confirmed</p>
          </div>
          <p className="mt-2 text-sm font-black text-navy">30 Min Intro with Alex</p>
          <p className="mt-1 text-xs text-muted">Thu, Oct 29 · 2:00 PM</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["Google", "Apple", "Outlook"].map((label) => (
            <div key={label} className="rounded-full border border-border py-1.5 text-center text-[9px] font-semibold text-navy">
              {label}
            </div>
          ))}
        </div>
      </div>
    </ScreenshotFrame>
  );
}

export function DashboardScreenshot() {
  return (
    <ScreenshotFrame title="Meetly host dashboard">
      <div className="grid min-h-[300px] grid-cols-[72px_1fr] sm:min-h-[360px]">
        <div className="space-y-2 bg-navy p-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`h-7 rounded-lg ${index === 0 ? "bg-lime" : "bg-navy-light"}`}
            />
          ))}
        </div>
        <div className="bg-surface p-4">
          <p className="text-sm font-black text-navy">Dashboard</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "This week", value: "4" },
              { label: "Event types", value: "2" },
              { label: "Calendar", value: "On" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-white p-2">
                <p className="text-[9px] text-muted">{stat.label}</p>
                <p className="text-lg font-black text-navy">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-border bg-white p-3">
            <p className="text-[10px] font-semibold text-muted">Upcoming meetings</p>
            <div className="mt-2 space-y-2">
              {["Jordan Lee · 30 Min Intro", "Sam Park · Discovery"].map((meeting) => (
                <div key={meeting} className="flex items-center justify-between rounded-lg bg-surface px-2 py-1.5">
                  <p className="text-[10px] font-semibold text-navy">{meeting}</p>
                  <p className="text-[9px] text-muted">Tomorrow</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="text-center">
                <p className="text-[8px] text-muted">{day}</p>
                <div className="mx-auto mt-1 h-8 w-full rounded-md bg-lime/20">
                  <div className="mx-auto mt-auto h-3/4 w-2 rounded-full bg-lime" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenshotFrame>
  );
}

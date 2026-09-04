type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-xl bg-surface-muted ${className}`} aria-hidden="true" />;
}

export function BookingsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border bg-surface p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-4 w-56" />
          <Skeleton className="mt-4 h-4 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
      ))}
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card">
          <Skeleton className="h-6 w-44" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookingFlowMainSkeleton() {
  return (
    <div className="card space-y-4">
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}

export function BookingFlowSkeleton() {
  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[minmax(0,420px)_1fr]">
      <aside className="bg-navy p-5 sm:p-8 lg:p-10">
        <Skeleton className="h-10 w-32" />
        <div className="mt-8 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-36" />
          </div>
        </div>
        <div className="mt-10 space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-6 w-28" />
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 bg-white p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-9 w-48" />
          <div className="card mt-8 space-y-4">
            <Skeleton className="h-7 w-40" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function ContactsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border bg-surface px-4 py-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-2 h-4 w-52" />
        </div>
      ))}
    </div>
  );
}

import Link from "next/link";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      {icon ? (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
          {icon}
        </div>
      ) : null}
      <p className="font-semibold text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? (
        action.href ? (
          <Link href={action.href} className="btn-primary mt-5 inline-flex min-h-[44px]">
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            className="btn-primary mt-5 min-h-[44px]"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}

export function CalendarEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 0 0 2-2V7H3v12a2 2 0 0 0 2 2z" />
    </svg>
  );
}

export function BookingsEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function EventTypeEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M12 4h9" />
      <path d="M4 9h16" />
      <path d="M4 15h16" />
    </svg>
  );
}

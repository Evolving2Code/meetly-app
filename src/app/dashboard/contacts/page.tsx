import Link from "next/link";
import { ContactsList } from "@/components/dashboard/ContactsList";

export default function ContactsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
            Guests
          </p>
          <h1 className="mt-1 text-3xl font-black text-navy sm:mt-2 sm:text-4xl">Contacts</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Everyone who has booked with you, plus contacts you add manually.
          </p>
        </div>

        <Link
          href="/dashboard/contacts/settings"
          className="btn-secondary min-h-[44px] gap-2 px-4"
          aria-label="Contacts settings"
        >
          <SettingsIcon />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </div>

      <ContactsList />
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

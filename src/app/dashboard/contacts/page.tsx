import { ContactsList } from "@/components/dashboard/ContactsList";

export default function ContactsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
          Guests
        </p>
        <h1 className="mt-1 text-3xl font-black text-navy sm:mt-2 sm:text-4xl">Contacts</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Everyone who has booked time with you, pulled automatically from your meetings.
        </p>
      </div>

      <ContactsList />
    </div>
  );
}

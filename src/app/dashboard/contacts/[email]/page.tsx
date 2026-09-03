import { ContactDetail } from "@/components/dashboard/ContactDetail";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <ContactDetail email={decodeURIComponent(email)} />
    </div>
  );
}

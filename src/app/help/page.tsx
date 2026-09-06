import { getSessionUser } from "@/lib/auth/session";
import { HelpPageContent } from "@/components/help/HelpPageContent";
import { HelpPageShell } from "@/components/help/HelpPageShell";

export default async function HelpPage() {
  const user = await getSessionUser();

  return (
    <HelpPageShell isLoggedIn={Boolean(user)}>
      <HelpPageContent />
    </HelpPageShell>
  );
}

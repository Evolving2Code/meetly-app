import { HelpPageContent } from "@/components/help/HelpPageContent";
import { HELP_LAST_UPDATED } from "@/components/help/HelpPageShell";
import Link from "next/link";

export default function DashboardHelpPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-dark sm:text-sm">
        Help
      </p>
      <h1 className="mt-1 text-3xl font-black text-foreground sm:mt-2 sm:text-4xl">
        Meetly host guide
      </h1>
      <p className="mt-2 text-muted">Last updated: {HELP_LAST_UPDATED}</p>
      <div className="legal-prose mt-8 max-w-3xl space-y-6 text-muted">
        <HelpPageContent />
      </div>
      <Link href="/dashboard" className="btn-primary mt-10 inline-flex">
        Back to dashboard
      </Link>
    </div>
  );
}

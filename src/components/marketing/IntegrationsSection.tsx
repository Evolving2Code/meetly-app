import { BrandIcon, type BrandIconName } from "@/components/icons/BrandIcons";

const integrations: Array<{ name: string; icon: BrandIconName }> = [
  { name: "Google Calendar", icon: "google-calendar" },
  { name: "Google Meet", icon: "google-meet" },
  { name: "Google Sign-In", icon: "google" },
  { name: "Microsoft Sign-In", icon: "microsoft" },
  { name: "Email auth", icon: "email" },
  { name: "Mobile PWA", icon: "pwa" },
];

export function IntegrationsSection() {
  return (
    <section className="border-y border-border bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted">
          Works with the tools you already use
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm transition hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-border">
                <BrandIcon name={item.icon} size={26} />
              </div>
              <span className="text-sm font-semibold text-navy">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const integrations = [
  { name: "Google Calendar", abbr: "GC" },
  { name: "Google Meet", abbr: "GM" },
  { name: "Google Sign-In", abbr: "G" },
  { name: "Microsoft Sign-In", abbr: "MS" },
  { name: "Email auth", abbr: "@" },
  { name: "Mobile PWA", abbr: "PWA" },
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
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-xs font-bold text-primary">
                {item.abbr}
              </div>
              <span className="text-sm font-semibold text-navy">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

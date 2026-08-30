const features = [
  {
    title: "Personal booking links",
    description: "Share /book/you/30-min anywhere — email, social, or your website.",
    icon: "🔗",
  },
  {
    title: "Weekly availability",
    description: "Set the hours you're open each week. Meetly handles the rest.",
    icon: "📅",
  },
  {
    title: "Smart scheduling rules",
    description: "Buffers, minimum notice, and booking windows keep you in control.",
    icon: "⚡",
  },
  {
    title: "Guest-friendly booking",
    description: "A clean mobile flow: date, time, details, confirmation.",
    icon: "📱",
  },
  {
    title: "Google Calendar sync",
    description: "Optional integration blocks busy times and creates events with Meet links.",
    icon: "🗓️",
  },
  {
    title: "Multiple sign-in options",
    description: "Email, Google, or Microsoft — account creation separate from calendar connect.",
    icon: "🔐",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Features</p>
          <h2 className="section-heading mt-3">Everything you need to start scheduling</h2>
          <p className="section-subheading mx-auto">
            Honest MVP features today — no fake enterprise promises. Replace copy and imagery
            here as Meetly grows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-accent-soft text-xl">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

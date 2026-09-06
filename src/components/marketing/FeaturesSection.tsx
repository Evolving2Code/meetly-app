import { FeatureIcon, type FeatureIconName } from "@/components/icons/BrandIcons";

const features: Array<{
  title: string;
  description: string;
  icon: FeatureIconName;
}> = [
  {
    title: "Personal booking links",
    description: "Share /book/you/30-min anywhere — email, social, or your website.",
    icon: "link",
  },
  {
    title: "Weekly availability",
    description: "Set the hours you're open each week. Meetly handles the rest.",
    icon: "calendar-clock",
  },
  {
    title: "Smart scheduling rules",
    description: "Buffers, minimum notice, and booking windows keep you in control.",
    icon: "sliders",
  },
  {
    title: "Guest-friendly booking",
    description: "A clean mobile flow: date, time, details, confirmation.",
    icon: "smartphone",
  },
  {
    title: "Google Calendar sync",
    description: "Optional integration blocks busy times and creates events with Meet links.",
    icon: "sync-calendar",
  },
  {
    title: "Multiple sign-in options",
    description: "Email, Google, or Microsoft — account creation separate from calendar connect.",
    icon: "shield-check",
  },
];

const cardThemes = [
  {
    card:
      "border-primary/15 bg-gradient-to-br from-primary-light via-white to-accent-soft shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 dark:border-primary/25 dark:from-primary-light/40 dark:via-surface dark:to-accent-soft/30",
    orb: "bg-accent/20 group-hover:bg-accent/30",
    icon: "bg-white/90 text-primary shadow-sm ring-1 ring-white/80 dark:bg-white/10 dark:ring-white/10",
  },
  {
    card:
      "border-accent/15 bg-gradient-to-br from-white via-primary-light/80 to-[#eefbf3] shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/15 dark:border-accent/20 dark:from-surface dark:via-primary-light/20 dark:to-[#12201a]/40",
    orb: "bg-lime/15 group-hover:bg-lime/25",
    icon: "bg-white/90 text-lime-dark shadow-sm ring-1 ring-white/80 dark:bg-white/10 dark:text-accent dark:ring-white/10",
  },
  {
    card:
      "border-accent-warm/15 bg-gradient-to-br from-[#fff7ed] via-white to-primary-light shadow-lg shadow-accent-warm/10 hover:shadow-xl hover:shadow-accent-warm/15 dark:border-accent-warm/20 dark:from-[#2a1f14]/50 dark:via-surface dark:to-primary-light/20",
    orb: "bg-accent-warm/15 group-hover:bg-accent-warm/25",
    icon: "bg-white/90 text-accent-warm shadow-sm ring-1 ring-white/80 dark:bg-white/10 dark:ring-white/10",
  },
  {
    card:
      "border-primary/15 bg-gradient-to-br from-[#f0f9ff] via-white to-accent-soft shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 dark:border-primary/25 dark:from-[#101822]/60 dark:via-surface dark:to-accent-soft/20",
    orb: "bg-primary/10 group-hover:bg-primary/20",
    icon: "bg-white/90 text-primary shadow-sm ring-1 ring-white/80 dark:bg-white/10 dark:ring-white/10",
  },
  {
    card:
      "border-accent/20 bg-gradient-to-br from-accent-soft via-white to-primary-light shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/15 dark:border-accent/25 dark:from-accent-soft/40 dark:via-surface dark:to-primary-light/25",
    orb: "bg-accent/20 group-hover:bg-accent/30",
    icon: "bg-white/90 text-accent shadow-sm ring-1 ring-white/80 dark:bg-white/10 dark:ring-white/10",
  },
  {
    card:
      "border-navy/10 bg-gradient-to-br from-slate-50 via-white to-primary-light shadow-lg shadow-navy/5 hover:shadow-xl hover:shadow-navy/10 dark:border-white/10 dark:from-navy-light dark:via-surface dark:to-primary-light/20",
    orb: "bg-navy/5 group-hover:bg-navy/10 dark:bg-primary/15 dark:group-hover:bg-primary/25",
    icon: "bg-white/90 text-navy shadow-sm ring-1 ring-white/80 dark:bg-white/10 dark:text-foreground dark:ring-white/10",
  },
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(64,161,168,0.08),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(132,204,22,0.06),transparent_38%),linear-gradient(180deg,var(--background)_0%,var(--surface)_100%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(76,120,255,0.1),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(0,209,255,0.06),transparent_38%),linear-gradient(180deg,var(--background)_0%,#0b0d12_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Features</p>
          <h2 className="section-heading mt-3">Everything you need to start scheduling</h2>
          <p className="section-subheading mx-auto">
            Booking links, availability rules, and calendar sync — everything you need to start taking meetings.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const theme = cardThemes[index % cardThemes.length];

            return (
              <article
                key={feature.title}
                className={`group relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 ${theme.card}`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl transition duration-500 ${theme.orb}`}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"
                />

                <div className="relative">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm transition duration-300 group-hover:scale-105 ${theme.icon}`}
                  >
                    <FeatureIcon name={feature.icon} size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

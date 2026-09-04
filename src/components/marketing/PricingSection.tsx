import Link from "next/link";

const plans = [
  {
    name: "Solo",
    price: "Free",
    description: "Everything you need to start sharing a booking link today.",
    features: [
      "Unlimited bookings",
      "Unlimited event types",
      "Email, Google & Microsoft login",
      "Guest booking flow",
      "Optional Google Calendar sync",
      "Mobile PWA install",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "Coming soon",
    description: "Team scheduling, payments, and intake forms for when solo hosting isn't enough.",
    features: [
      "Team scheduling",
      "Payment collection",
      "Routing forms",
    ],
    cta: "Join waitlist",
    href: "mailto:hello@meetly.app?subject=Meetly%20Pro%20waitlist",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pricing</p>
          <h2 className="section-heading mt-3">Start free. Upgrade when you&apos;re ready.</h2>
          <p className="section-subheading mx-auto">
            Meetly is free for solo hosts. No credit card required.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 ${
                plan.highlighted
                  ? "border-primary bg-white shadow-xl shadow-primary/10"
                  : "border-border bg-white shadow-sm"
              }`}
            >
              {plan.highlighted && <span className="badge-primary">Most popular</span>}
              <h3 className="mt-4 text-2xl font-bold text-navy">{plan.name}</h3>
              <p className="mt-2 text-4xl font-bold text-primary">{plan.price}</p>
              <p className="mt-3 text-sm text-muted">{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-navy">
                    <span className="text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex w-full justify-center ${
                  plan.highlighted ? "btn-primary py-3.5" : "btn-secondary py-3.5"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

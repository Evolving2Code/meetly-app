import {
  AvailabilityScreenshot,
  ConfirmationScreenshot,
  SignupScreenshot,
} from "@/components/marketing/ProductScreenshots";

const steps = [
  {
    step: "01",
    title: "Create your account",
    description:
      "Sign up with email, Google, or Microsoft. Connect Google Calendar anytime in Settings when you want busy-time blocking and automatic events.",
    preview: <SignupScreenshot />,
  },
  {
    step: "02",
    title: "Set your availability",
    description:
      "Choose your weekly hours, event types, buffers, and booking limits. Meetly generates a personal booking link you can share anywhere.",
    preview: <AvailabilityScreenshot />,
  },
  {
    step: "03",
    title: "Guests book in seconds",
    description:
      "Invitees pick a date and time, enter their details, and get confirmation — with Google Calendar events and Meet links when you're connected.",
    preview: <ConfirmationScreenshot />,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">How it works</p>
          <h2 className="section-heading mt-3">From signup to booked meeting in minutes</h2>
          <p className="section-subheading">
            Three steps from account to confirmed meeting — built for solo hosts who want a booking page that looks as good as it works.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item) => (
            <article
              key={item.step}
              className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative p-4 pb-0">
                <div className="absolute left-7 top-7 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">
                  Step {item.step}
                </div>
                <div className="transition duration-500 group-hover:scale-[1.02]">{item.preview}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is Meetly really free?",
    a: "Yes. The solo host plan is free during our MVP phase. No credit card required to sign up.",
  },
  {
    q: "Do guests need an account?",
    a: "No. Guests book through your public link with just their name and email.",
  },
  {
    q: "Do I need Google Calendar to use Meetly?",
    a: "No. Calendar connection is optional. Connect it in Settings when you want busy-time blocking and automatic Google events.",
  },
  {
    q: "Can I sign up with Microsoft?",
    a: "Yes. Meetly supports email, Google, and Microsoft sign-in. Calendar sync is Google Calendar only for now.",
  },
  {
    q: "Can I install Meetly on my phone?",
    a: "Yes. Meetly is a PWA — use Add to Home Screen on iOS or Install app on Android after visiting the site.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
          <h2 className="section-heading mt-3">Questions hosts ask first</h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="overflow-hidden rounded-2xl border border-border bg-white">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-semibold text-navy">{faq.q}</span>
                  <span className="text-primary">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

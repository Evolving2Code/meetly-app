import Link from "next/link";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";

const productLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const accountLinks = [
  { href: "/signup", label: "Sign up" },
  { href: "/login", label: "Log in" },
  { href: "/dashboard", label: "Dashboard" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <MeetlyLogo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Calendly-style scheduling for solo hosts. Share your link, set your hours, and let
              guests book time that works.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Product</p>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Account</p>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Legal</p>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-slate-400">
          © {new Date().getFullYear()} Meetly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

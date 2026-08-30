import Link from "next/link";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/">
          <MeetlyLogo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary px-5">
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-navy transition hover:bg-surface sm:inline-flex"
              >
                Log in
              </Link>
              <a href="#get-started" className="btn-primary px-5">
                Get started
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

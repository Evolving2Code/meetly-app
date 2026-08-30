import Link from "next/link";
import { ReactNode } from "react";
import { MeetlyLogo } from "@/components/marketing/MeetlyLogo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="marketing-gradient flex flex-col justify-between p-6 sm:p-10 lg:border-r lg:border-border">
        <Link href="/">
          <MeetlyLogo />
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Meetly for solo hosts
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-navy">
            Your calendar,
            <br />
            your brand.
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Create your account, set availability, and share a booking link. Connect Google
            Calendar anytime from Settings.
          </p>
        </div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} Meetly</p>
      </div>

      <div className="flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
          <p className="mt-8 text-center text-xs text-muted">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ReactNode } from "react";

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
      <div className="flex flex-col justify-between bg-navy p-6 text-white sm:p-10">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-lg font-black text-navy">
              M
            </div>
            <span className="text-xl font-bold">Meetly</span>
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-black leading-tight">
            Your calendar,
            <br />
            your brand.
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Create your account, set availability, and share a booking link. Connect Google
            Calendar anytime from Settings.
          </p>
        </div>
        <p className="text-sm text-slate-500">© 2026 Meetly</p>
      </div>

      <div className="flex items-center justify-center bg-surface p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-black text-navy sm:text-3xl">{title}</h2>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        </div>
      </div>
    </div>
  );
}

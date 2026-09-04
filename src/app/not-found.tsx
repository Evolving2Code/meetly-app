import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="card max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-dark">
          Not found
        </p>
        <h1 className="mt-3 text-3xl font-black text-navy">Page not found</h1>
        <p className="mt-3 text-muted">
          The link may be broken, or the page may have been moved or removed.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back home
        </Link>
      </div>
    </div>
  );
}

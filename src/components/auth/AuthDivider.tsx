"use client";

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">or</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

"use client";

type SignOutButtonProps = {
  variant?: "default" | "sidebar" | "header" | "menu";
  onSignedOut?: () => void;
};

export function SignOutButton({ variant = "default", onSignedOut }: SignOutButtonProps) {
  async function signOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    onSignedOut?.();
    window.location.href = "/";
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={signOut}
        className="flex min-h-[44px] w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-navy transition hover:bg-surface"
        role="menuitem"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
        Log out
      </button>
    );
  }

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={signOut}
        className="min-h-[44px] rounded-lg px-3 text-sm font-semibold text-navy transition hover:bg-surface"
      >
        Sign out
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={signOut}
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-slate-600 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="btn-secondary w-full border-slate-300 text-navy"
    >
      Sign out
    </button>
  );
}

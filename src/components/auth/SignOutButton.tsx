"use client";

type SignOutButtonProps = {
  variant?: "default" | "sidebar" | "header";
};

export function SignOutButton({ variant = "default" }: SignOutButtonProps) {
  async function signOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
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

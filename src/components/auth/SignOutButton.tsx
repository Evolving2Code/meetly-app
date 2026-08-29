"use client";

export function SignOutButton() {
  async function signOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
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

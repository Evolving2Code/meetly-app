"use client";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-navy"
    >
      Sign out
    </button>
  );
}

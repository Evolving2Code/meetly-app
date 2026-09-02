import type { User } from "@supabase/supabase-js";

export function isEmailAuthUser(user: User): boolean {
  if (user.app_metadata?.provider === "email") {
    return true;
  }

  return (user.identities ?? []).some((identity) => identity.provider === "email");
}

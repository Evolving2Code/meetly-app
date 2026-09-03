export function getSiteOrigin(fallback?: string) {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? fallback ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function getCalendarOAuthRedirectUri(origin?: string) {
  return `${getSiteOrigin(origin)}/auth/callback/google-calendar`;
}

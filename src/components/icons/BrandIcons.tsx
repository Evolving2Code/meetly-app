import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  className?: string;
};

function IconShell({
  size = 24,
  className = "",
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function GoogleIcon({ size = 18, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </IconShell>
  );
}

export function MicrosoftIcon({ size = 18, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path fill="#F25022" d="M3 3h8v8H3z" />
      <path fill="#7FBA00" d="M13 3h8v8h-8z" />
      <path fill="#00A4EF" d="M3 13h8v8H3z" />
      <path fill="#FFB900" d="M13 13h8v8h-8z" />
    </IconShell>
  );
}

export function GoogleCalendarIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#FFFFFF" stroke="#DADCE0" />
      <rect x="3" y="5" width="18" height="5" rx="2" fill="#1A73E8" />
      <rect x="3" y="8" width="18" height="2" fill="#1A73E8" />
      <rect x="6.5" y="12.5" width="3.5" height="3.5" rx="0.5" fill="#EA4335" />
      <rect x="11.25" y="12.5" width="3.5" height="3.5" rx="0.5" fill="#FBBC04" />
      <rect x="16" y="12.5" width="3.5" height="3.5" rx="0.5" fill="#34A853" />
      <rect x="6.5" y="17" width="3.5" height="3.5" rx="0.5" fill="#4285F4" />
      <rect x="11.25" y="17" width="3.5" height="3.5" rx="0.5" fill="#1A73E8" />
    </IconShell>
  );
}

export function GoogleMeetIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <rect x="2" y="6" width="14" height="12" rx="2" fill="#00832D" />
      <path d="M16 9.5 22 6.5V17.5L16 14.5V9.5Z" fill="#00AC47" />
      <path d="M7 10.5H11V13.5H7V10.5Z" fill="#FFFFFF" />
    </IconShell>
  );
}

export function EmailIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.5" />
      <path d="M4 7.5 12 12.5 20 7.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
    </IconShell>
  );
}

export function PwaIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <rect x="7" y="2" width="10" height="20" rx="2" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.5" />
      <circle cx="12" cy="19" r="1" fill="#4F46E5" />
      <rect x="9" y="5" width="6" height="9" rx="1" fill="#FFFFFF" stroke="#818CF8" strokeWidth="1" />
    </IconShell>
  );
}

export function LinkIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path
        d="M10 8h4a3 3 0 0 1 0 6h-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 16h-4a3 3 0 0 1 0-6h1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconShell>
  );
}

export function CalendarClockIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 13.5V15l1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconShell>
  );
}

export function SlidersIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="15" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="11" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </IconShell>
  );
}

export function SmartphoneIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </IconShell>
  );
}

export function SyncCalendarIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path
        d="M7 4V2M17 4V2M4 8h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 13a3 3 0 1 1-5.2-2.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M12 11v3l1.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </IconShell>
  );
}

export function ShieldCheckIcon({ size = 24, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path
        d="M12 3 20 7v6c0 4.4-3.3 7.4-8 8-4.7-.6-8-3.6-8-8V7l8-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </IconShell>
  );
}

export type BrandIconName =
  | "google"
  | "microsoft"
  | "google-calendar"
  | "google-meet"
  | "email"
  | "pwa";

const brandIconMap = {
  google: GoogleIcon,
  microsoft: MicrosoftIcon,
  "google-calendar": GoogleCalendarIcon,
  "google-meet": GoogleMeetIcon,
  email: EmailIcon,
  pwa: PwaIcon,
} as const;

export function BrandIcon({
  name,
  size = 24,
  className,
}: IconProps & { name: BrandIconName }) {
  const Icon = brandIconMap[name];
  return <Icon size={size} className={className} />;
}

export type FeatureIconName =
  | "link"
  | "calendar-clock"
  | "sliders"
  | "smartphone"
  | "sync-calendar"
  | "shield-check";

const featureIconMap = {
  link: LinkIcon,
  "calendar-clock": CalendarClockIcon,
  sliders: SlidersIcon,
  smartphone: SmartphoneIcon,
  "sync-calendar": SyncCalendarIcon,
  "shield-check": ShieldCheckIcon,
} as const;

export function FeatureIcon({
  name,
  size = 24,
  className = "text-primary",
}: IconProps & { name: FeatureIconName }) {
  const Icon = featureIconMap[name];
  return <Icon size={size} className={className} />;
}

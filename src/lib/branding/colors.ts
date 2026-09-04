import type { CSSProperties } from "react";

export const DEFAULT_BRAND_COLOR = "#12385F";

export const BRAND_COLOR_PRESETS = [
  "#12385F",
  "#0F172A",
  "#7C3AED",
  "#DC2626",
  "#059669",
  "#2563EB",
  "#DB2777",
  "#EA580C",
] as const;

export function isValidBrandColor(color: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function normalizeBrandColor(color: string | null | undefined) {
  if (color && isValidBrandColor(color)) {
    return color.toUpperCase();
  }

  return DEFAULT_BRAND_COLOR;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function mixHex(color: string, mix: string, weight: number) {
  const base = hexToRgb(color);
  const target = hexToRgb(mix);

  return rgbToHex(
    base.r + (target.r - base.r) * weight,
    base.g + (target.g - base.g) * weight,
    base.b + (target.b - base.b) * weight,
  );
}

export function getHostThemeStyle(brandColor: string | null | undefined) {
  const brand = normalizeBrandColor(brandColor);

  return {
    "--host-brand": brand,
    "--host-brand-light": mixHex(brand, "#FFFFFF", 0.14),
    "--host-accent": "#84CC16",
  } as CSSProperties;
}

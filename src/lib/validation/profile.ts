const DISPLAY_NAME_MAX_LENGTH = 80;

export function normalizeDisplayName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function validateDisplayName(value: string): string | null {
  const name = normalizeDisplayName(value);

  if (!name) {
    return "Display name is required.";
  }

  if (name.length > DISPLAY_NAME_MAX_LENGTH) {
    return `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or fewer.`;
  }

  return null;
}

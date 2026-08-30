const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function validateUsername(value: string): string | null {
  const username = normalizeUsername(value);

  if (!username) {
    return "Username is required.";
  }

  if (username.length < 2) {
    return "Username must be at least 2 characters.";
  }

  if (username.length > 40) {
    return "Username must be 40 characters or fewer.";
  }

  if (!USERNAME_PATTERN.test(username)) {
    return "Username can only use lowercase letters, numbers, and hyphens.";
  }

  return null;
}

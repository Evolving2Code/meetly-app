const MIN_PASSWORD_LENGTH = 8;

export function validatePassword(value: string): string | null {
  if (!value) {
    return "Password is required.";
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return null;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | null {
  if (password !== confirmation) {
    return "Passwords do not match.";
  }

  return null;
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  validatePassword,
  validatePasswordConfirmation,
} from "@/lib/validation/password";

export function PasswordChangeForm({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setLoading(false);
      setError(passwordError);
      return;
    }

    const confirmationError = validatePasswordConfirmation(newPassword, confirmPassword);
    if (confirmationError) {
      setLoading(false);
      setError(confirmationError);
      return;
    }

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (verifyError) {
      setLoading(false);
      setError("Current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Password updated.");
  }

  return (
    <section className="card">
      <h2 className="text-xl font-black">Password</h2>
      <p className="mt-2 text-sm text-muted">
        Update the password for your email sign-in. OAuth sign-in is not affected.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="label">Current password</span>
          <input
            className="input"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <label className="block">
          <span className="label">New password</span>
          <input
            className="input"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <label className="block">
          <span className="label">Confirm new password</span>
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        {message && <p className="text-sm font-medium text-lime-dark">{message}</p>}
      </form>
    </section>
  );
}

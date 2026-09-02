"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileAvatarEditor({
  name,
  avatarUrl,
  onAvatarChange,
}: {
  name: string;
  avatarUrl: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = (name || "U").slice(0, 1).toUpperCase();
  const busy = uploading || removing;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not upload photo.");
      return;
    }

    const profile = await response.json();
    onAvatarChange(profile.avatar_url ?? null);
    router.refresh();
  }

  async function handleRemove() {
    setRemoving(true);
    setError(null);

    const response = await fetch("/api/profile", { method: "DELETE" });

    setRemoving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not remove photo.");
      return;
    }

    onAvatarChange(null);
    router.refresh();
  }

  return (
    <div>
      <span className="label">Profile photo</span>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="h-20 w-20 rounded-full border-2 border-border object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white">
            {initials}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary min-h-[44px]"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading..." : avatarUrl ? "Change photo" : "Upload photo"}
          </button>
          {avatarUrl && (
            <button
              type="button"
              className="btn-secondary min-h-[44px]"
              disabled={busy}
              onClick={handleRemove}
            >
              {removing ? "Removing..." : "Remove"}
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="mt-2 text-xs text-muted">JPEG, PNG, WebP, or GIF. Max 2 MB.</p>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

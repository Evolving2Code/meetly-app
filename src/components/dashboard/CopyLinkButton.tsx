"use client";

export function CopyLinkButton({ path, label }: { path: string; label: string }) {
  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  return (
    <button
      type="button"
      className="btn-primary"
      onClick={async () => {
        await navigator.clipboard.writeText(fullUrl);
      }}
    >
      {label}
    </button>
  );
}

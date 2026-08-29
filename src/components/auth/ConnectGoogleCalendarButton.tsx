"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConnectGoogleCalendarButton({ connected }: { connected: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  async function connect() {
    setLoading(true);
    window.location.href = "/api/integrations/google/connect";
  }

  async function disconnect() {
    setDisconnecting(true);
    const response = await fetch("/api/integrations/google/connect", { method: "DELETE" });
    setDisconnecting(false);

    if (response.ok) {
      router.refresh();
    }
  }

  if (connected) {
    return (
      <button
        type="button"
        className="btn-secondary"
        disabled={disconnecting}
        onClick={disconnect}
      >
        {disconnecting ? "Disconnecting..." : "Disconnect calendar"}
      </button>
    );
  }

  return (
    <button type="button" className="btn-primary" disabled={loading} onClick={connect}>
      {loading ? "Redirecting..." : "Connect Google Calendar"}
    </button>
  );
}

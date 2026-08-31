"use client";

import { MeetlyIcon } from "@/components/marketing/MeetlyIcon";
import { useEffect, useState } from "react";
import {
  dismissInstallPrompt,
  isBeforeInstallPromptEvent,
  isIosSafari,
  isStandaloneApp,
  wasInstallPromptDismissed,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa/install";

type PromptMode = "native" | "ios" | null;

function getInitialPromptMode(): PromptMode {
  if (typeof window === "undefined") {
    return null;
  }

  if (isStandaloneApp() || wasInstallPromptDismissed()) {
    return null;
  }

  if (isIosSafari()) {
    return "ios";
  }

  return null;
}

export function PwaInstallPrompt({ variant = "banner" }: { variant?: "banner" | "card" }) {
  const [mode, setMode] = useState<PromptMode>(getInitialPromptMode);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (mode !== null) {
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      if (!isBeforeInstallPromptEvent(event)) {
        return;
      }
      setDeferredPrompt(event);
      setMode("native");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [mode]);

  function handleDismiss() {
    dismissInstallPrompt();
    setMode(null);
    setDeferredPrompt(null);
  }

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    setInstalling(true);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setInstalling(false);

    if (choice.outcome === "accepted") {
      setMode(null);
      setDeferredPrompt(null);
      return;
    }
  }

  if (!mode) {
    return null;
  }

  const wrapperClass =
    variant === "card"
      ? "rounded-3xl border border-primary/15 bg-gradient-to-br from-primary-light to-white p-5 shadow-sm sm:p-6"
      : "border-b border-primary/10 bg-gradient-to-r from-primary-light via-white to-accent-soft";

  const innerClass =
    variant === "card"
      ? "flex flex-col gap-4"
      : "mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8";

  return (
    <div className={wrapperClass} role="region" aria-label="Install Meetly app">
      <div className={innerClass}>
        <div className="flex items-start gap-3">
          <MeetlyIcon className="h-11 w-11 shadow-sm" />
          <div>
            <p className="font-semibold text-navy">
              {mode === "ios" ? "Add Meetly to your Home Screen" : "Install the Meetly app"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {mode === "ios"
                ? "Tap Share, then Add to Home Screen for quick access to your dashboard and booking links."
                : "Install Meetly on this device for a faster, app-like experience — no app store required."}
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-2 ${variant === "card" ? "" : "sm:shrink-0"}`}>
          {mode === "native" && (
            <button
              type="button"
              className="btn-primary px-5"
              onClick={handleInstall}
              disabled={installing}
            >
              {installing ? "Installing..." : "Install app"}
            </button>
          )}
          {mode === "ios" && (
            <span className="badge-primary">Share → Add to Home Screen</span>
          )}
          <button
            type="button"
            className="btn-secondary px-5"
            onClick={handleDismiss}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

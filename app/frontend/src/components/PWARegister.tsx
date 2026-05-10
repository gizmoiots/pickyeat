"use client";

import { useEffect } from "react";

// Registers the service worker on first page mount. Silent on dev / unsupported.

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (e) {
        console.warn("[sw] registration failed", e);
      }
    };
    register();
  }, []);

  return null;
}

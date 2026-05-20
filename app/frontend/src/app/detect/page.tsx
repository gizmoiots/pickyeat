"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import type { Restaurant } from "@/lib/types";

// 02 — GPS detect. Reads real browser geolocation, falls back to Pune center
// if the user denies permission or the browser doesn't support it.

type State =
  | { kind: "asking" }
  | { kind: "denied" }
  | { kind: "loading" }
  | { kind: "found"; restaurant: Restaurant }
  | { kind: "none" };

// Pune city centre — used as the fallback when geolocation is denied so the
// flow still works (cache hit on a popular city-centre restaurant).
const PUNE_FALLBACK = { lat: 18.5204, lng: 73.8567 };

export default function DetectPage() {
  const [state, setState] = useState<State>({ kind: "asking" });

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      // No geolocation API — fall back to Pune centre
      lookup(PUNE_FALLBACK.lat, PUNE_FALLBACK.lng);
      return;
    }
    setState({ kind: "asking" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lookup(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState({ kind: "denied" });
        } else {
          // POSITION_UNAVAILABLE or TIMEOUT — fall back to Pune
          lookup(PUNE_FALLBACK.lat, PUNE_FALLBACK.lng);
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  };

  const lookup = async (lat: number, lng: number) => {
    setState({ kind: "loading" });
    try {
      const r = await api.detectRestaurant(lat, lng);
      setState(r ? { kind: "found", restaurant: r } : { kind: "none" });
    } catch (e) {
      setState({ kind: "none" });
    }
  };

  // ── render ─────────────────────────────────────────────────────────
  if (state.kind === "asking" || state.kind === "loading") {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex-1 grid place-items-center text-pepper/60">
          {state.kind === "asking" ? "checking your location…" : "looking around…"}
        </div>
      </AppShell>
    );
  }

  if (state.kind === "denied") {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto gap-3">
          <EyebrowLabel>location needed</EyebrowLabel>
          <h1 className="text-2xl font-bold leading-tight">
            We can't see where you are<span className="text-sprig">.</span>
          </h1>
          <p className="text-sm text-pepper/70 leading-relaxed">
            Enable location permission in your browser, or skip to scan a menu
            manually.
          </p>
          <div className="flex flex-col gap-3 w-full pt-6">
            <PrimaryButton onClick={requestLocation}>Try again</PrimaryButton>
            <Link href="/scan" className="text-center text-sm text-pepper/60">
              Skip — scan a menu instead
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (state.kind === "none") {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto gap-3">
          <h1 className="text-2xl font-bold leading-tight">No restaurant nearby.</h1>
          <p className="text-sm text-pepper/70">
            We couldn't find a known restaurant within 100m of you. Scan a menu
            and we'll add it.
          </p>
          <div className="pt-6 w-full">
            <Link href="/scan">
              <PrimaryButton>Scan a menu</PrimaryButton>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // found
  const r = state.restaurant;
  const isHit = (r.scanCount ?? 0) > 0;

  return (
    <AppShell showBottomNav={false}>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 max-w-xs mx-auto">
        <div className="w-14 h-14 rounded-full bg-coconut border-hair border-pepper/15 grid place-items-center relative">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F26B3A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sprig" />
        </div>

        <EyebrowLabel className="mt-3">
          {isHit ? "you're at" : "looks like you're at"}
        </EyebrowLabel>

        <h1 className="text-3xl font-bold leading-tight">{r.name}</h1>

        {isHit ? (
          <p className="text-sm text-pepper/70 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sprig" />
            {r.scanCount} picks here this month
          </p>
        ) : (
          <p className="text-sm text-pepper/70">No saved menu yet — let's scan it.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <Link href={isHit ? "/mood" : "/scan"}>
          <PrimaryButton>{isHit ? "Use saved menu" : "Scan their menu"}</PrimaryButton>
        </Link>
        <Link href="/scan" className="text-center text-sm text-pepper/60">
          {isHit ? "Scan a different menu" : "Different place"}
        </Link>
      </div>
    </AppShell>
  );
}

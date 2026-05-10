"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import type { Restaurant } from "@/lib/types";

// 02 — GPS detect. Cache-hit copy by default; if scanCount === 0 we fall
// through to cache-miss copy.

export default function DetectPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real builds: navigator.geolocation.getCurrentPosition(...)
    // For demo: hand a Pune lat/lng to the mock client.
    api.detectRestaurant(18.5204, 73.8567).then((r) => {
      setRestaurant(r);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex-1 grid place-items-center text-pepper/60">
          looking around…
        </div>
      </AppShell>
    );
  }

  if (!restaurant) {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex-1 grid place-items-center text-pepper/60">
          We couldn't find a restaurant near you.
        </div>
      </AppShell>
    );
  }

  const isHit = (restaurant.scanCount ?? 0) > 0;

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

        <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>

        {isHit ? (
          <p className="text-sm text-pepper/70 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sprig" />
            {restaurant.scanCount} picks here this month
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

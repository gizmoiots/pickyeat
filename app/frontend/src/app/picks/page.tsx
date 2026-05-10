"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DishCard } from "@/components/DishCard";
import { api } from "@/lib/api";
import { cafeMocha } from "@/lib/mockData";
import type { Pick } from "@/lib/types";

// 07 — Picks main result. The hero deliverable. Three cards, all with the
// Coconut bowl-icon placeholder (no stock photos). Mint dot in upper right.

export default function PicksPage() {
  const [picks, setPicks] = useState<Pick[] | null>(null);

  useEffect(() => {
    api.recommend(cafeMocha.id, { spice: "medium" }).then(setPicks);
  }, []);

  return (
    <AppShell>
      <div className="flex items-center gap-1.5 text-xs text-pepper/60">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        Pune, India
      </div>
      <h1 className="text-2xl font-bold mt-1 mb-1">
        <Link href={`/restaurant/${cafeMocha.id}`} className="no-underline">
          {cafeMocha.name}<span className="text-sprig">.</span>
        </Link>
      </h1>
      <p className="text-xs text-pepper/60 mb-6">
        {cafeMocha.address} · {cafeMocha.scanCount} picks this month
      </p>

      <div className="flex flex-col gap-4">
        {picks
          ? picks.map((p) => (
              <DishCard key={p.dish.id} dish={{ ...p.dish, reason: p.reason }} isPick />
            ))
          : Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-card bg-white border-hair border-pepper/10 animate-pulse"
              />
            ))}
      </div>

      <Link href="/feedback/dish_butter_chicken" className="block text-center text-sm text-pepper/60 mt-6">
        I've ordered → leave feedback
      </Link>
    </AppShell>
  );
}

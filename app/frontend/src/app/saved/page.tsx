"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { DishCard } from "@/components/DishCard";
import { dishes } from "@/lib/mockData";

// Bucket list. Dishes the user has pinned for later. Free-signed-in feature.

export default function SavedPage() {
  // In live mode this comes from /api/saved with the bearer token.
  const saved = dishes.slice(0, 2);

  return (
    <AppShell>
      <EyebrowLabel>your bucket list</EyebrowLabel>
      <h1 className="text-3xl font-bold leading-tight mt-1 mb-6">
        Saved for later<span className="text-sprig">.</span>
      </h1>

      {saved.length === 0 ? (
        <div className="text-center py-12 text-pepper/60">
          <p className="mb-3">Nothing saved yet.</p>
          <Link href="/" className="text-spice underline">
            Find something to try
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {saved.map((d) => (
            <DishCard key={d.id} dish={d} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

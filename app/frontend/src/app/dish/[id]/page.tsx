"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DishPlaceholder } from "@/components/DishPlaceholder";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import type { Dish } from "@/lib/types";

// 08 — Dish detail. Coconut placeholder (never stock). Reasons + macro estimate.

export default function DishDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);

  useEffect(() => {
    api.getDish(id).then(setDish);
  }, [id]);

  if (!dish) {
    return (
      <AppShell showBottomNav={false} back="/picks">
        <div className="flex-1 grid place-items-center text-pepper/60">loading…</div>
      </AppShell>
    );
  }

  return (
    <AppShell showBottomNav={false} back="/picks">
      <DishPlaceholder className="rounded-panel h-56 w-full" />

      <div className="mt-5 flex items-start justify-between gap-3">
        <h1 className="text-3xl font-bold leading-tight">
          {dish.name}
          {dish.crowdFavorite && <span className="text-sprig">.</span>}
        </h1>
        <span className="text-spice font-bold text-xl whitespace-nowrap">
          ₹{dish.priceInr}
        </span>
      </div>

      {dish.crowdFavorite && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-sprig font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-sprig" />
          three reviews mention this
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {dish.estCalories && (
          <span className="text-xs px-3 py-1 rounded-full bg-white border-hair border-pepper/10">
            ~{dish.estCalories} cal estimated
          </span>
        )}
        {dish.estMacros?.protein && (
          <span className="text-xs px-3 py-1 rounded-full bg-white border-hair border-pepper/10">
            {dish.estMacros.protein}g protein
          </span>
        )}
        {dish.allergens?.map((a) => (
          <span
            key={a}
            className="text-xs px-3 py-1 rounded-full bg-white border-hair border-pepper/10 text-pepper/70"
          >
            contains {a}
          </span>
        ))}
      </div>

      {dish.description && (
        <p className="mt-5 text-sm leading-relaxed text-pepper/80">
          {dish.description}
        </p>
      )}

      <div className="mt-auto pt-8 flex flex-col gap-2">
        <Link href={`/feedback/${dish.id}`}>
          <PrimaryButton>I ordered this</PrimaryButton>
        </Link>
        <Link href="/picks" className="text-center text-sm text-pepper/60">
          Skip
        </Link>
      </div>
    </AppShell>
  );
}

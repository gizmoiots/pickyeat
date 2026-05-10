"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DishCard } from "@/components/DishCard";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import type { Dish, Restaurant } from "@/lib/types";

// 12 — Restaurant detail. Pulled in v1 — extends naturally to v1.5.

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{ restaurant: Restaurant; dishes: Dish[] } | null>(null);

  useEffect(() => {
    api.getMenu(id).then(setData);
  }, [id]);

  if (!data) {
    return (
      <AppShell back="/picks">
        <div className="flex-1 grid place-items-center text-pepper/60">loading…</div>
      </AppShell>
    );
  }

  const { restaurant, dishes } = data;

  return (
    <AppShell back="/picks">
      <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-pepper/70">
        {restaurant.googleRating && (
          <span className="inline-flex items-center gap-1">
            ★ {restaurant.googleRating.toFixed(1)}
          </span>
        )}
        {restaurant.googleReviewCount && (
          <span>· {restaurant.googleReviewCount.toLocaleString()} reviews</span>
        )}
        <span>· {restaurant.cuisineTags[0]}</span>
      </div>
      <div className="text-xs text-pepper/60 mt-1 mb-5">{restaurant.address}</div>

      <EyebrowLabel className="mb-3">top picks here</EyebrowLabel>

      <div className="flex flex-col gap-3">
        {dishes.slice(0, 3).map((d) => (
          <DishCard
            key={d.id}
            dish={d}
            isPick={restaurant.bestsellers?.includes(d.name) ?? false}
          />
        ))}
      </div>

      <EyebrowLabel className="mt-6 mb-3">what people loved</EyebrowLabel>
      <div className="bg-white rounded-card border-hair border-pepper/10 p-4 text-sm leading-relaxed text-pepper/80">
        "Their butter chicken is unreal — best in Pune by a mile."
        <div className="text-xs text-pepper/50 mt-2">— Ananya R · 5 ★</div>
      </div>

      <div className="mt-auto pt-6">
        <Link href="/mood">
          <PrimaryButton>Pick something to order</PrimaryButton>
        </Link>
      </div>
    </AppShell>
  );
}

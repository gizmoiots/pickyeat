"use client";

import Link from "next/link";
import { DishPlaceholder } from "./DishPlaceholder";
import type { Dish } from "@/lib/types";

type Props = { dish: Dish; isPick?: boolean };

export function DishCard({ dish, isPick = false }: Props) {
  return (
    <Link
      href={`/dish/${dish.id}`}
      className="block bg-white rounded-card border-hair border-pepper/10 overflow-hidden hover:border-pepper/30 transition-colors"
    >
      <div className="relative">
        <DishPlaceholder className="h-40 w-full rounded-t-card" />
        {isPick && (
          <span
            className="absolute top-3 right-3 w-2 h-2 rounded-full bg-sprig"
            aria-label="Recommended pick"
          />
        )}
        {dish.crowdFavorite && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-white border-hair border-sprig/40 text-sprig text-xs font-medium px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-sprig" />
            crowd favorite
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight">{dish.name}</h3>
          <span className="text-spice font-bold whitespace-nowrap">
            ₹{dish.priceInr}
          </span>
        </div>
        {dish.reason && (
          <p className="mt-2 text-sm text-pepper/70 leading-relaxed">
            {dish.reason}
          </p>
        )}
      </div>
    </Link>
  );
}

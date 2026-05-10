"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";

type Craving = "drinks" | "quick" | "food" | "full-meal";

const tiles: { id: Craving; label: string; subtitle: string; icon: JSX.Element }[] = [
  {
    id: "drinks",
    label: "Drinks",
    subtitle: "Sip & chill",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8421C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3h14l-2 12a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4L5 3z" />
        <path d="M12 19v3" />
      </svg>
    )
  },
  {
    id: "quick",
    label: "Quick",
    subtitle: "Fast bites",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8421C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    )
  },
  {
    id: "food",
    label: "Food",
    subtitle: "Regular portions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8421C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2v8M7 14v8M11 2v6a3 3 0 0 1-4 0V2" />
        <path d="M16 2v20M19 12c-1.5 0-3-3-3-7s1.5-3 3-3" />
      </svg>
    )
  },
  {
    id: "full-meal",
    label: "Full meal",
    subtitle: "Hungry for more",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8421C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16h20M4 16a8 8 0 0 1 16 0M5 12c0-1 1-2 2-2M11 8c0-1 1-2 2-2" />
      </svg>
    )
  }
];

export default function MoodPage() {
  const [picked, setPicked] = useState<Craving | null>(null);

  return (
    <AppShell>
      <EyebrowLabel>what are you craving?</EyebrowLabel>
      <h1 className="text-2xl font-bold leading-tight mt-1 mb-6">
        Pick a flow.
      </h1>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const selected = picked === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setPicked(t.id)}
              className={`relative bg-white rounded-card p-5 text-left border-hair transition-colors aspect-square flex flex-col justify-between
                ${selected ? "border-saffron" : "border-pepper/10 hover:border-pepper/25"}
              `}
            >
              {selected && (
                <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-sprig" />
              )}
              <div className="ml-auto">{t.icon}</div>
              <div>
                <div className="text-lg font-bold">{t.label}</div>
                <div className="text-xs text-pepper/60 mt-0.5">{t.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <Link href={picked ? "/toggles" : "#"}>
          <PrimaryButton disabled={!picked}>
            {picked ? "Continue" : "Pick one to continue"}
          </PrimaryButton>
        </Link>
      </div>
    </AppShell>
  );
}

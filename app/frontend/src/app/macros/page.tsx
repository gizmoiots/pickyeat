"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";

// Premium-only screen. Daily and weekly macro totals + chart. For MVP we
// render with hardcoded sample data; live mode aggregates from feedback.
// Real recharts integration ships when premium tier goes live in Phase 5.

const week = [
  { day: "Mon", cal: 1850, protein: 92 },
  { day: "Tue", cal: 2200, protein: 105 },
  { day: "Wed", cal: 1740, protein: 88 },
  { day: "Thu", cal: 2080, protein: 110 },
  { day: "Fri", cal: 2310, protein: 118 },
  { day: "Sat", cal: 2450, protein: 95 },
  { day: "Sun", cal: 1920, protein: 102 }
];

const maxCal = Math.max(...week.map((d) => d.cal));

export default function MacrosPage() {
  const isPremium = false; // wire to /api/billing/status in live mode

  if (!isPremium) {
    return (
      <AppShell>
        <EyebrowLabel>macros</EyebrowLabel>
        <h1 className="text-3xl font-bold leading-tight mt-1 mb-3">
          Macros are premium<span className="text-sprig">.</span>
        </h1>
        <p className="text-sm text-pepper/70 mb-6 leading-relaxed">
          Daily and weekly totals, week-over-week deltas, charted by macro.
          Less than a chai a month.
        </p>

        <div className="bg-white rounded-card border-hair border-pepper/10 p-5 opacity-60">
          <BarChart />
        </div>

        <div className="mt-8">
          <Link href="/premium">
            <PrimaryButton>Unlock for ₹49 / month</PrimaryButton>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <EyebrowLabel>this week</EyebrowLabel>
      <h1 className="text-3xl font-bold leading-tight mt-1 mb-1">
        14,550 cal · 710g protein
      </h1>
      <p className="text-sm text-pepper/60 mb-6">
        +8% protein vs last week. On track for bulking.
      </p>

      <div className="bg-white rounded-card border-hair border-pepper/10 p-5">
        <BarChart />
      </div>
    </AppShell>
  );
}

function BarChart() {
  return (
    <div>
      <div className="flex items-end justify-between gap-2 h-40">
        {week.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-coconut rounded-md relative" style={{ height: "100%" }}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-saffron rounded-md"
                style={{ height: `${(d.cal / maxCal) * 100}%` }}
              />
            </div>
            <div className="text-xs text-pepper/60">{d.day}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-pepper/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-saffron" />
          Calories
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sprig" />
          Protein
        </span>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { EyebrowLabel } from "@/components/EyebrowLabel";

type Dashboard = {
  restaurant: { id: string; name: string; address: string; tier: string };
  scansThisMonth: number;
  topPickedDishes: { name: string; pickCount: number; orderRate: number }[];
  dietaryMix: { veg: number; nonveg: number; vegan: number };
  recentFeedback: { dishName: string; rating: string; notes?: string; when: string }[];
};

export default function OwnerDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("pickyeat_owner_token") : null;
    if (!token) {
      window.location.href = "/owner/login";
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000"}/api/owner/dashboard`, {
      headers: { authorization: `Bearer ${token}` }
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-coconut text-pepper grid place-items-center px-5 text-center">
        <div>
          <p className="text-spice font-medium mb-2">Couldn't load your dashboard.</p>
          <p className="text-pepper/70 text-sm">{error}</p>
          <Link href="/owner/login" className="text-spice underline mt-4 inline-block">
            Sign in again
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-coconut text-pepper grid place-items-center">
        <p className="text-pepper/60">loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coconut text-pepper">
      <header className="px-5 py-4 flex items-center justify-between border-b-hair border-pepper/10 max-w-4xl mx-auto">
        <Link href="/owner" className="flex items-center gap-2 no-underline">
          <BrandMark size={28} />
          <span className="font-medium text-lg">{data.restaurant.name}</span>
        </Link>
        <span className="text-xs text-pepper/60 capitalize bg-white border-hair border-pepper/15 px-3 py-1 rounded-full">
          {data.restaurant.tier} plan
        </span>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8">
        <h1 className="text-3xl font-bold leading-tight">
          {greeting()}<span className="text-sprig">.</span>
        </h1>
        <p className="text-sm text-pepper/60 mt-1">{data.restaurant.address}</p>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <Metric label="Scans this month" value={data.scansThisMonth.toString()} />
          <Metric label="Top dish" value={data.topPickedDishes[0]?.name ?? "—"} />
          <Metric
            label="Veg vs non-veg"
            value={`${Math.round((data.dietaryMix.veg / (data.dietaryMix.veg + data.dietaryMix.nonveg)) * 100)}% veg`}
          />
          <Metric label="Order rate" value={`${data.topPickedDishes[0]?.orderRate ?? 0}%`} />
        </section>

        <section className="mt-10">
          <EyebrowLabel className="mb-3">top picked dishes</EyebrowLabel>
          <div className="bg-white rounded-card border-hair border-pepper/10 divide-y divide-pepper/10">
            {data.topPickedDishes.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-pepper/40 font-mono w-5">{i + 1}</span>
                  <span className="font-medium">{d.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-pepper/60">
                  <span>{d.pickCount} picks</span>
                  <span>{d.orderRate}% order rate</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <EyebrowLabel className="mb-3">recent diner feedback</EyebrowLabel>
          <div className="bg-white rounded-card border-hair border-pepper/10 divide-y divide-pepper/10">
            {data.recentFeedback.length === 0 ? (
              <div className="px-4 py-6 text-center text-pepper/60 text-sm">
                No feedback yet. Diners can leave notes after their meal.
              </div>
            ) : (
              data.recentFeedback.map((f, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{f.dishName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        f.rating === "loved it"
                          ? "bg-sprig/15 text-sprig"
                          : f.rating === "disliked"
                          ? "bg-spice/15 text-spice"
                          : "bg-pepper/10 text-pepper/70"
                      }`}
                    >
                      {f.rating}
                    </span>
                  </div>
                  {f.notes && <p className="text-sm text-pepper/70 mt-1">"{f.notes}"</p>}
                  <p className="text-xs text-pepper/50 mt-1">{f.when}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-10 bg-white rounded-card border-hair border-pepper/10 p-5">
          <EyebrowLabel className="mb-2">coming soon</EyebrowLabel>
          <p className="text-sm text-pepper/80">
            Menu editor, daily specials, and "verified" upgrade unlock in the
            next release. WhatsApp us at{" "}
            <a href="https://wa.me/919876512472" className="text-spice underline">
              +91 98765 12472
            </a>{" "}
            with anything you want to change today.
          </p>
        </section>

        <footer className="mt-12 pt-6 border-t-hair border-pepper/10 flex items-center justify-between text-sm text-pepper/60">
          <button
            onClick={() => {
              localStorage.removeItem("pickyeat_owner_token");
              window.location.href = "/owner/login";
            }}
          >
            Sign out
          </button>
          <Link href="/owners" className="text-pepper/60">
            About pickyeat for restaurants
          </Link>
        </footer>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-card border-hair border-pepper/10 p-4">
      <div className="text-xs text-pepper/60">{label}</div>
      <div className="text-lg font-bold mt-1 truncate">{value}</div>
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";

type Plan = "monthly" | "yearly";

const FEATURES: { title: string; body: string }[] = [
  { title: "Macro tracking", body: "Daily and weekly totals, week-over-week deltas, charted." },
  { title: "Health-app sync", body: "Apple Health, Google Fit, Fitbit — your meals show up where your workouts do." },
  { title: "Group mode 5+", body: "Free is capped at 4 friends. Premium unlocks any size group." },
  { title: "Find me a dish like X", body: "Reverse search on your taste graph — \"the butter chicken I had last week, but lighter\"." },
  { title: "Restaurant predictions", body: "Based on your last 30 picks, the spots in Pune you'd love next." },
  { title: "Ad-free, always", body: "Even if we ever run ads, premium never sees them." }
];

export default function PremiumPage() {
  const [plan, setPlan] = useState<Plan>("yearly");
  const [loading, setLoading] = useState(false);
  const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

  const subscribe = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("pickyeat_token") : null;
    if (!token) {
      window.location.href = "/signin?returnTo=/premium";
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${base}/api/billing/subscribe`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan })
      });
      const data = await r.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <AppShell showBottomNav={false}>
      <EyebrowLabel>pickyeat plus</EyebrowLabel>
      <h1 className="text-3xl font-bold leading-tight mt-2">
        Less than a chai a month<span className="text-sprig">.</span>
      </h1>
      <p className="text-sm text-pepper/70 mt-2 leading-relaxed">
        Cancel any time. UPI autopay. No tricks.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <PlanCard
          name="Yearly"
          price="₹499"
          per="for the year"
          equiv="₹42 / month effective"
          selected={plan === "yearly"}
          recommended
          onClick={() => setPlan("yearly")}
        />
        <PlanCard
          name="Monthly"
          price="₹49"
          per="per month"
          equiv="cancel any time"
          selected={plan === "monthly"}
          onClick={() => setPlan("monthly")}
        />
      </div>

      <ul className="mt-8 space-y-4">
        {FEATURES.map((f) => (
          <li key={f.title} className="flex gap-3">
            <span className="w-2 h-2 rounded-full bg-sprig mt-2 shrink-0" />
            <div>
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-pepper/70 leading-relaxed">{f.body}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <PrimaryButton onClick={subscribe} disabled={loading}>
          {loading ? "Redirecting…" : `Subscribe — ${plan === "yearly" ? "₹499 / year" : "₹49 / month"}`}
        </PrimaryButton>
        <p className="text-xs text-pepper/50 text-center mt-3">
          Secure checkout via Razorpay. Backed by <Link href="/terms" className="underline">our terms</Link>.
        </p>
      </div>
    </AppShell>
  );
}

function PlanCard({
  name,
  price,
  per,
  equiv,
  selected,
  recommended,
  onClick
}: {
  name: string;
  price: string;
  per: string;
  equiv: string;
  selected: boolean;
  recommended?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-card p-4 transition-colors ${
        selected
          ? "border-2 border-saffron bg-coconut"
          : "border-hair border-pepper/15 bg-white"
      }`}
    >
      {recommended && (
        <span className="absolute -top-2 right-3 text-xs font-medium bg-sprig text-coconut px-2 py-0.5 rounded-full">
          best value
        </span>
      )}
      <div className="text-xs text-pepper/60">{name}</div>
      <div className="text-2xl font-bold mt-1">{price}</div>
      <div className="text-xs text-pepper/60">{per}</div>
      <div className="text-xs text-pepper/50 mt-2">{equiv}</div>
    </button>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";

type Scan = {
  id: string;
  restaurantName: string;
  when: string;
  picks: string[];
};

export default function HistoryPage() {
  const [items, setItems] = useState<Scan[] | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
    const userId = typeof window !== "undefined" ? localStorage.getItem("pickyeat_user_id") : null;
    fetch(`${base}/api/history?userId=${userId ?? ""}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems);
  }, []);

  return (
    <AppShell>
      <EyebrowLabel>history</EyebrowLabel>
      <h1 className="text-3xl font-bold leading-tight mt-1 mb-6">
        Where you've been<span className="text-sprig">.</span>
      </h1>

      {items === null && <div className="text-pepper/60">loading…</div>}

      {items && items.length === 0 && (
        <div className="text-center py-12 text-pepper/60">
          <p className="mb-3">You haven't scanned anything yet.</p>
          <Link href="/" className="text-spice underline">
            Pick something to eat
          </Link>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-card border-hair border-pepper/10 p-4"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-medium">{s.restaurantName}</div>
                <div className="text-xs text-pepper/50">
                  {new Date(s.when).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short"
                  })}
                </div>
              </div>
              <ul className="mt-2 space-y-1">
                {s.picks.map((p) => (
                  <li
                    key={p}
                    className="text-sm text-pepper/70 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-sprig" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

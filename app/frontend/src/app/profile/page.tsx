"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Chip } from "@/components/Chip";
import { api } from "@/lib/api";
import type { Profile } from "@/lib/types";

// 10 — What we know about you. Privacy-forward. Every stored field exposed.

export default function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    api.getProfile().then(setP);
  }, []);

  if (!p) {
    return (
      <AppShell>
        <div className="flex-1 grid place-items-center text-pepper/60">loading…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-bold leading-tight">
        what we know about you<span className="text-sprig">.</span>
      </h1>
      <p className="text-sm text-pepper/60 mt-2 mb-5">
        Everything we store is below. Edit, export, or delete any of it any time.
      </p>

      <section className="bg-coconut border-hair border-pepper/10 rounded-card p-4 mb-5">
        <div className="text-xs font-medium text-spice mb-1">Taste analysis</div>
        <div className="text-sm">you tend to love: {p.tasteSummary}</div>
        <div className="flex items-end gap-1 h-12 mt-3">
          {[30, 78, 50, 25, 62, 40, 55].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                h > 60 ? "bg-sprig" : h > 40 ? "bg-sprig/60" : "bg-sprig/20"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </section>

      <Section title="Diet defaults">
        <Chip selected>{p.dietDefault ?? "none set"}</Chip>
      </Section>

      <Section title="Allergens">
        <div className="bg-white rounded-card border-hair border-pepper/10 px-4 py-3 text-sm">
          {p.allergens.length ? p.allergens.join(", ") : "None on file"}
        </div>
      </Section>

      <Section title="Spice tolerance">
        <div className="flex gap-2">
          {(["mild", "medium", "hot"] as const).map((s) => (
            <Chip key={s} selected={p.spiceDefault === s}>
              {s}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Health goal">
        <div className="bg-white rounded-card border-hair border-pepper/10 px-4 py-3 text-sm">
          {p.healthGoal ?? "Not set"}
        </div>
      </Section>

      <Section title="Language">
        <div className="bg-white rounded-card border-hair border-pepper/10 px-4 py-3 text-sm">
          {p.language === "en-IN" ? "English (India)" : p.language}
        </div>
      </Section>

      <button
        type="button"
        className="mt-4 mb-2 text-sm font-medium text-spice text-center w-full py-3"
      >
        Delete everything
      </button>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="text-xs font-medium uppercase tracking-eyebrow text-pepper/60 mb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Chip } from "@/components/Chip";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";

const macros = ["high protein", "low carb", "balanced", "low fat"] as const;
const diets = ["vegan", "jain", "gluten-free", "halal", "diabetic-friendly"] as const;
const allergens = ["nuts", "dairy", "eggs", "shellfish", "soy", "gluten"] as const;

export default function HealthPage() {
  const [cal, setCal] = useState(500);
  const [macro, setMacro] = useState<(typeof macros)[number]>("high protein");
  const [diet, setDiet] = useState<Set<string>>(new Set());
  const [allergy, setAllergy] = useState<Set<string>>(new Set(["nuts", "dairy"]));

  const toggle = (set: Set<string>, fn: (s: Set<string>) => void, v: string) => {
    const n = new Set(set);
    n.has(v) ? n.delete(v) : n.add(v);
    fn(n);
  };

  return (
    <AppShell>
      <EyebrowLabel>health mode</EyebrowLabel>
      <h1 className="text-2xl font-bold leading-tight mt-1 mb-6">
        Fine-tune the picks.
      </h1>

      <section className="bg-white rounded-card border-hair border-pepper/10 p-4 mb-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-eyebrow text-pepper/60">
          Daily calorie target
          <span className="text-spice text-base font-bold tracking-normal normal-case">
            {cal.toLocaleString()} <span className="text-xs text-pepper/60">kcal</span>
          </span>
        </div>
        <input
          type="range"
          min={1200}
          max={4000}
          step={50}
          value={cal}
          onChange={(e) => setCal(Number(e.target.value))}
          className="w-full mt-3 accent-spice"
        />
        <div className="flex justify-between text-[11px] text-pepper/50 mt-1">
          <span>1,200</span>
          <span>4,000</span>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="text-xs font-medium uppercase tracking-eyebrow text-pepper/60 mb-2">
          Macro focus
        </h2>
        <div className="flex flex-wrap gap-2">
          {macros.map((m) => (
            <Chip key={m} selected={macro === m} onClick={() => setMacro(m)}>
              {m}
            </Chip>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <h2 className="text-xs font-medium uppercase tracking-eyebrow text-pepper/60 mb-2">
          Specific diet
        </h2>
        <div className="flex flex-wrap gap-2">
          {diets.map((d) => (
            <Chip key={d} selected={diet.has(d)} onClick={() => toggle(diet, setDiet, d)}>
              {d}
            </Chip>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <h2 className="text-xs font-medium uppercase tracking-eyebrow text-pepper/60 mb-2">
          Allergens to avoid
        </h2>
        <div className="flex flex-wrap gap-2">
          {allergens.map((a) => (
            <Chip key={a} selected={allergy.has(a)} onClick={() => toggle(allergy, setAllergy, a)}>
              {allergy.has(a) ? `${a} ×` : `+ ${a}`}
            </Chip>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-pepper/50 italic text-center mt-2">
        macros are estimates, ±20%
      </p>

      <div className="mt-auto pt-6">
        <Link href="/picks">
          <PrimaryButton>Update health mode</PrimaryButton>
        </Link>
      </div>
    </AppShell>
  );
}

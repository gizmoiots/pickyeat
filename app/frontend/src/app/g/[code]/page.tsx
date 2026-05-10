"use client";

// Guest join flow. Opens in any browser from the share link — no app install,
// no signup. Submit your prefs, host gets them, group picks resolve when
// everyone has submitted.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Wordmark } from "@/components/Wordmark";
import { Chip } from "@/components/Chip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { EyebrowLabel } from "@/components/EyebrowLabel";

const spiceOptions = ["mild", "medium", "hot", "any"] as const;
const dietOptions = ["veg", "vegan", "jain", "nonveg"] as const;
const allergenOptions = ["nuts", "dairy", "eggs", "shellfish", "soy", "gluten"] as const;

export default function GroupJoinPage() {
  const router = useRouter();
  const { code } = useParams<{ code: string }>();
  const [name, setName] = useState("");
  const [diet, setDiet] = useState<string>("nonveg");
  const [spice, setSpice] = useState<string>("medium");
  const [allergens, setAllergens] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const toggleAllergen = (a: string) => {
    const n = new Set(allergens);
    n.has(a) ? n.delete(a) : n.add(a);
    setAllergens(n);
  };

  const join = async () => {
    setSubmitting(true);
    const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
    await fetch(`${base}/api/group/${code}/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        prefs: { diet, spice, allergens: Array.from(allergens) }
      })
    });
    setDone(true);
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-coconut text-pepper flex flex-col">
        <header className="px-5 py-4 flex items-center gap-2 border-b-hair border-pepper/10">
          <BrandMark size={24} />
          <Wordmark className="text-base" />
        </header>
        <main className="flex-1 px-5 py-8 max-w-md w-full mx-auto flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-sprig/15 grid place-items-center mt-12">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2BB673" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mt-6">You're in.</h1>
          <p className="text-sm text-pepper/70 mt-2 leading-relaxed">
            We sent your prefs to the host. They'll see picks that work for the whole table.
          </p>
          <Link href="/" className="text-spice underline text-sm mt-6">
            Want pickyeat for yourself? Install it
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coconut text-pepper flex flex-col">
      <header className="px-5 py-4 flex items-center gap-2 border-b-hair border-pepper/10">
        <BrandMark size={24} />
        <Wordmark className="text-base" />
      </header>
      <main className="flex-1 px-5 py-6 max-w-md w-full mx-auto flex flex-col">
        <EyebrowLabel>group order · {code}</EyebrowLabel>
        <h1 className="text-2xl font-bold leading-tight mt-1 mb-4">
          What can you eat?
        </h1>
        <p className="text-sm text-pepper/70 mb-6">
          Quick — 3 questions so we can pick dishes the whole table can share.
        </p>

        <label className="text-sm font-medium block mb-2">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Maya"
          className="bg-white border-hair border-pepper/15 rounded-card px-4 py-3 outline-none focus:border-pepper/40"
        />

        <Section title="Diet">
          {dietOptions.map((d) => (
            <Chip key={d} selected={diet === d} onClick={() => setDiet(d)}>
              {d}
            </Chip>
          ))}
        </Section>

        <Section title="Spice">
          {spiceOptions.map((s) => (
            <Chip key={s} selected={spice === s} onClick={() => setSpice(s)}>
              {s}
            </Chip>
          ))}
        </Section>

        <Section title="Anything you can't eat?">
          {allergenOptions.map((a) => (
            <Chip
              key={a}
              selected={allergens.has(a)}
              onClick={() => toggleAllergen(a)}
            >
              {allergens.has(a) ? `${a} ×` : `+ ${a}`}
            </Chip>
          ))}
        </Section>

        <div className="mt-auto pt-8">
          <PrimaryButton onClick={join} disabled={!name.trim() || submitting}>
            {submitting ? "Sending…" : "Join the group"}
          </PrimaryButton>
          <p className="text-xs text-pepper/50 text-center mt-3">
            No app install. We won't save your number.
          </p>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="text-sm font-medium mb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

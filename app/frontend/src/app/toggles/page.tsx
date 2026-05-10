"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Chip } from "@/components/Chip";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";

const spice = ["mild", "medium", "hot", "any"] as const;
const budget = ["≤₹150", "≤₹300", "≤₹500", "no limit"] as const;
const hunger = ["peckish", "normal", "starving"] as const;
const occasion = ["solo", "date", "business", "family", "celebration"] as const;

export default function TogglesPage() {
  const [s, setS] = useState<(typeof spice)[number]>("medium");
  const [b, setB] = useState<(typeof budget)[number]>("≤₹500");
  const [h, setH] = useState<(typeof hunger)[number]>("normal");
  const [o, setO] = useState<(typeof occasion)[number] | null>(null);

  return (
    <AppShell>
      <EyebrowLabel>fine-tune</EyebrowLabel>
      <h1 className="text-2xl font-bold leading-tight mt-1 mb-6">
        What's your mood?
      </h1>

      <Group title="Spice">
        {spice.map((v) => (
          <Chip key={v} selected={s === v} onClick={() => setS(v)}>
            {v}
          </Chip>
        ))}
      </Group>

      <Group title="Budget per dish">
        {budget.map((v) => (
          <Chip key={v} selected={b === v} onClick={() => setB(v)}>
            {v}
          </Chip>
        ))}
      </Group>

      <Group title="Hunger">
        {hunger.map((v) => (
          <Chip key={v} selected={h === v} onClick={() => setH(v)}>
            {v}
          </Chip>
        ))}
      </Group>

      <Group title="Occasion">
        {occasion.map((v) => (
          <Chip key={v} selected={o === v} onClick={() => setO(v)}>
            {v}
          </Chip>
        ))}
      </Group>

      <div className="mt-auto pt-8">
        <Link href="/picks">
          <PrimaryButton>Show my picks</PrimaryButton>
        </Link>
        <Link href="/health" className="block text-center text-sm text-pepper/60 mt-3">
          + Add health filters
        </Link>
      </div>
    </AppShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-xs font-medium uppercase tracking-eyebrow text-pepper/60 mb-2">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

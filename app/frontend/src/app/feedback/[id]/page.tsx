"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Chip } from "@/components/Chip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import { dishById, cafeMocha } from "@/lib/mockData";

// 09 — I ordered this. Photo upload, three rating chips, optional notes.

export default function FeedbackPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const dish = dishById(id);
  const [rating, setRating] = useState<"loved it" | "fine" | "disliked" | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await api.submitFeedback("scan_demo", id, rating ?? "ordered", notes);
    router.push("/picks");
  };

  return (
    <AppShell showBottomNav={false} back={`/dish/${id}`}>
      <div className="bg-white rounded-card border-hair border-pepper/10 p-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-coconut grid place-items-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F26B3A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18a8 8 0 0 1-18 0z" fill="#F26B3A" stroke="none" />
          </svg>
        </div>
        <div className="text-sm">
          <div className="font-medium">{dish?.name ?? "Your dish"}</div>
          <div className="text-pepper/60 text-xs">
            from {cafeMocha.name} · just now
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-base font-medium">
        Share what it actually looked like
      </h2>
      <p className="text-xs text-pepper/60">
        Real photos help the next person — staged shots don't.
      </p>

      <button
        type="button"
        className="mt-3 rounded-panel h-44 w-full border-2 border-dashed border-pepper/25 grid place-items-center bg-coconut hover:border-pepper/40 transition-colors"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-saffron/10 grid place-items-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F26B3A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <circle cx="12" cy="12" r="3.5" />
            </svg>
          </div>
          <p className="text-sm text-pepper/70 mt-2">Tap to upload your photo</p>
        </div>
      </button>

      <h2 className="mt-6 text-base font-medium">How was it?</h2>
      <div className="mt-2 flex gap-2">
        {(["loved it", "fine", "disliked"] as const).map((r) => (
          <Chip key={r} selected={rating === r} onClick={() => setRating(r)}>
            {r}
          </Chip>
        ))}
      </div>

      <h2 className="mt-6 text-base font-medium">Add a note (optional)</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="The seasoning was perfect…"
        className="mt-2 w-full bg-white rounded-card border-hair border-pepper/15 p-3 text-sm text-pepper placeholder:text-pepper/40 outline-none focus:border-pepper/40 min-h-[100px] resize-none"
      />

      <div className="mt-auto pt-6">
        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </PrimaryButton>
      </div>
    </AppShell>
  );
}

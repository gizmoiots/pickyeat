"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import type { Group } from "@/lib/types";

// 11 — Group order host view. 4-digit code, member chips, "find dishes for everyone".

export default function GroupPage() {
  const [g, setG] = useState<Group | null>(null);
  useEffect(() => {
    api.getGroup("4827").then(setG);
  }, []);

  if (!g) {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex-1 grid place-items-center text-pepper/60">loading…</div>
      </AppShell>
    );
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="text-center mb-5">
        <EyebrowLabel>group order code</EyebrowLabel>
        <div className="font-bold text-6xl tracking-tight mt-2">{g.code}</div>
      </div>

      <button className="mx-auto mb-6 inline-flex items-center gap-2 bg-saffron text-coconut px-5 py-3 rounded-full font-medium">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M8.5 10.5l7-3.5M8.5 13.5l7 3.5" />
        </svg>
        Share invite link
      </button>

      <div className="flex items-center justify-between text-xs uppercase tracking-eyebrow text-pepper/60 mb-3">
        <span>group members ({g.members.length})</span>
        <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-sprig text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-sprig" />
          live
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {g.members.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-card border-hair border-pepper/10 p-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-coconut grid place-items-center font-bold text-pepper">
              {m.name[0]}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{m.name}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[
                  ...(m.prefs.diet ?? []),
                  ...(m.prefs.allergens ?? []).map((a) => `no ${a}`),
                  ...(m.prefs.spice ? [m.prefs.spice] : [])
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full border-hair border-pepper/15 text-pepper/70 inline-flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-sprig" />
                    {tag}
                  </span>
                ))}
                {!m.prefs.diet?.length &&
                  !m.prefs.allergens?.length &&
                  !m.prefs.spice && (
                    <span className="text-[11px] text-pepper/50 italic">
                      no preferences yet
                    </span>
                  )}
              </div>
            </div>
            {m.id === g.hostUserId && (
              <span className="text-[11px] text-pepper/50">host</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <PrimaryButton>Find dishes that fit everyone →</PrimaryButton>
      </div>
    </AppShell>
  );
}

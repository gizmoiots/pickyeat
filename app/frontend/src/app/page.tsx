"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Wordmark } from "@/components/Wordmark";
import { PrimaryButton } from "@/components/PrimaryButton";

// 01 — Splash. Brand-led, single CTA.
// No bottom nav, no header chrome. Mark-with-dot is intentional (drift-fix from v1).

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-coconut text-pepper flex flex-col items-center justify-between px-6 py-16">
      <div className="flex-1" />

      <div className="flex flex-col items-center gap-4">
        <BrandMark size={120} />
        <Wordmark className="text-4xl mt-2" />
        <div className="text-[11px] tracking-eyebrow uppercase text-pepper/60 mt-1">
          scan&nbsp;·&nbsp;pick&nbsp;·&nbsp;eat
        </div>
      </div>

      <div className="flex-1" />

      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <p className="text-center text-sm text-pepper/70 leading-relaxed px-4">
          Allow location and we'll spot your restaurant before you even open the menu.
        </p>
        <Link href="/detect" className="w-full">
          <PrimaryButton>Allow location</PrimaryButton>
        </Link>
        <Link href="/scan" className="text-sm text-pepper/60">
          Skip — I'll scan a menu
        </Link>
      </div>
    </div>
  );
}

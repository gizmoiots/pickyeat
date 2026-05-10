"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PrimaryButton } from "@/components/PrimaryButton";

// 03 — Camera scan placeholder. Real build calls navigator.mediaDevices.getUserMedia
// and sends the captured frame to /api/scan. For now, a dashed framing box.

export default function ScanPage() {
  const [translateOn, setTranslateOn] = useState(false);

  return (
    <AppShell showBottomNav={false}>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow">frame the menu</p>
          <button
            type="button"
            onClick={() => setTranslateOn((v) => !v)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border-hair transition-colors
              ${translateOn ? "border-pepper bg-coconut" : "border-pepper/20 text-pepper/70 bg-white"}
            `}
          >
            {translateOn && <span className="w-1.5 h-1.5 rounded-full bg-sprig" />}
            Translate to English
          </button>
        </div>

        <div className="flex-1 rounded-panel border-hair border-pepper/15 bg-pepper/[0.04] grid place-items-center relative overflow-hidden">
          <div className="absolute inset-6 border-2 border-dashed border-sprig/60 rounded-card" />
          <p className="text-pepper/50 text-sm relative">
            (camera viewport)
          </p>
        </div>

        <p className="text-xs text-pepper/50 text-center mt-4">
          We'll OCR the menu and pick dishes that match your mood.
        </p>

        <div className="mt-6">
          <Link href="/mood">
            <PrimaryButton>Capture menu</PrimaryButton>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

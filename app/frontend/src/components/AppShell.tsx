"use client";

import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { Wordmark } from "./Wordmark";
import { BottomNav } from "./BottomNav";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  back?: string;
};

// AppShell wraps every screen in a phone-frame-friendly column with the
// pickyeat header and (optionally) the bottom nav. Splash/scan/group screens
// can hide the chrome by passing showHeader={false} / showBottomNav={false}.

export function AppShell({
  children,
  showHeader = true,
  showBottomNav = true,
  back
}: Props) {
  return (
    <div className="min-h-screen bg-coconut text-pepper flex flex-col">
      {showHeader && (
        <header className="px-5 py-3 flex items-center justify-between border-b-hair border-pepper/10">
          <Link href={back ?? "/"} className="flex items-center gap-2 no-underline">
            <BrandMark size={28} />
            <Wordmark className="text-lg" />
          </Link>
          <button
            type="button"
            aria-label="Notifications"
            className="w-9 h-9 grid place-items-center text-pepper/70 hover:text-pepper"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
        </header>
      )}

      <main className="flex-1 px-5 py-6 flex flex-col">{children}</main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}

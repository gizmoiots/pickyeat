// Optional dev-only phone frame. Wraps content in a 390px column for
// development on a desktop browser. Disabled in production.

import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-pepper grid place-items-center p-6 sm:p-10">
      <div className="w-[390px] max-w-full bg-coconut rounded-[36px] overflow-hidden shadow-none border-hair border-pepper/20">
        {children}
      </div>
    </div>
  );
}

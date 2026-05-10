"use client";

import { ReactNode } from "react";

type Props = {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  size?: "sm" | "md";
};

// Pill chip used for spice / budget / hunger / occasion / allergens.
// Selected state adds a Sprig dot prefix.

export function Chip({ selected = false, onClick, children, size = "md" }: Props) {
  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border-hair font-medium transition-colors
        ${padding}
        ${selected ? "border-pepper text-pepper bg-coconut" : "border-pepper/20 text-pepper/80 bg-white hover:border-pepper/40"}
      `}
    >
      {selected && <span className="w-1.5 h-1.5 rounded-full bg-sprig" aria-hidden />}
      {children}
    </button>
  );
}

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
  children: ReactNode;
};

export function PrimaryButton({
  variant = "primary",
  full = true,
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-medium text-base transition-colors active:scale-[0.99]";
  const styles =
    variant === "primary"
      ? "bg-saffron text-coconut hover:bg-spice"
      : variant === "secondary"
      ? "border-hair border-spice text-spice hover:bg-spice/5"
      : "text-pepper/70 hover:text-pepper";
  return (
    <button
      type="button"
      className={`${base} ${styles} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

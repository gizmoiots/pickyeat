"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/picks", label: "Home", icon: "home" },
  { href: "/profile", label: "Profile", icon: "user" }
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="border-t-hair border-pepper/10 bg-coconut">
      <ul className="flex">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className={`flex flex-col items-center gap-1 py-3 ${
                  active ? "text-spice" : "text-pepper/70"
                }`}
              >
                <Icon name={it.icon} active={active} />
                <span className="text-xs font-medium">{it.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-sprig" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Icon({ name, active }: { name: "home" | "user"; active: boolean }) {
  if (name === "home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 4l9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}

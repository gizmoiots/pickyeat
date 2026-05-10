import { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export function EyebrowLabel({ children, className = "" }: Props) {
  return (
    <div
      className={`text-[11px] font-medium uppercase tracking-eyebrow text-pepper/60 ${className}`}
    >
      {children}
    </div>
  );
}

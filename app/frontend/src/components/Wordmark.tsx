// pickyeat wordmark — Pepper text + Sprig period.
// Use inline with the BrandMark for the primary lockup.

type Props = { className?: string };

export function Wordmark({ className = "" }: Props) {
  return (
    <span
      className={`font-sans font-bold tracking-tight text-pepper ${className}`}
    >
      pickyeat<span className="text-sprig">.</span>
    </span>
  );
}

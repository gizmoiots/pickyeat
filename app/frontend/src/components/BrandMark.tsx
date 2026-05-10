// pickyeat brand mark — saffron bowl + sprig dot.
// Always shows the dot. Size via the `size` prop.

type Props = { size?: number; className?: string };

export function BrandMark({ size = 48, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="pickyeat"
    >
      <g transform="translate(0,8)">
        <path d="M 48 116 H 208 A 80 80 0 0 1 48 116 Z" fill="#F26B3A" />
        <circle cx="176" cy="72" r="22" fill="#2BB673" />
      </g>
    </svg>
  );
}

// Cream-on-saffron knockout for app-icon contexts.
export function BrandMarkKnockout({ size = 48, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="pickyeat"
    >
      <rect width="256" height="256" rx="56" fill="#F26B3A" />
      <g transform="translate(0,8)">
        <path d="M 48 116 H 208 A 80 80 0 0 1 48 116 Z" fill="#FFF8EE" />
        <circle cx="176" cy="72" r="22" fill="#2BB673" />
      </g>
    </svg>
  );
}

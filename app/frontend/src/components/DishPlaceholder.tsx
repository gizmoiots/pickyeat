// Coconut placeholder for dishes without a user-uploaded photo.
// A small saffron bowl-and-steam icon on a Coconut tile, per brand spec.
// NEVER use stock food photography — always this placeholder until a real
// dish_photos record is approved.

type Props = { className?: string };

export function DishPlaceholder({ className = "" }: Props) {
  return (
    <div
      className={`bg-coconut grid place-items-center ${className}`}
      aria-hidden
    >
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        {/* steam */}
        <path d="M22 14c0 4 4 4 4 8s-4 4-4 8" stroke="#F26B3A" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 10c0 4 4 4 4 8s-4 4-4 8" stroke="#F26B3A" strokeWidth="2" strokeLinecap="round" />
        <path d="M42 14c0 4 4 4 4 8s-4 4-4 8" stroke="#F26B3A" strokeWidth="2" strokeLinecap="round" />
        {/* bowl */}
        <path d="M10 38h44a22 22 0 0 1-44 0z" fill="#F26B3A" />
      </svg>
    </div>
  );
}

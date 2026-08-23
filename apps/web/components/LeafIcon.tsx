export default function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Leaf main body */}
      <path d="M12 22C6.5 22 3 17.5 3 12S7.5 3 17 2c2.5 0 4 1.5 4 4 0 9.5-3.5 16-9 16Z" />
      {/* Central Stem & Vein */}
      <path d="M3 21c4-4 8-7 14-9" strokeWidth={2} />
      {/* Leaf Side Vein Details */}
      <path d="M9.5 14.5l3.5-1.5" strokeWidth={1.5} opacity="0.75" />
      <path d="M6.8 17.2l3.2-1.2" strokeWidth={1.5} opacity="0.75" />
      {/* AI Lens aperture & scanner focus circle */}
      <circle cx="14" cy="8" r="2.5" strokeWidth={1.5} />
      <path d="M14 4.5v1M14 10.5v1M10.5 8h1M16.5 8h1" strokeWidth={1.2} opacity="0.8" />
    </svg>
  );
}



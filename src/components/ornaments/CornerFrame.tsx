type Corner = 'tl' | 'tr' | 'bl' | 'br';

const FLIP: Record<Corner, string> = {
  tl: '',
  tr: '-scale-x-100',
  bl: '-scale-y-100',
  br: '-scale-x-100 -scale-y-100',
};

const PLACE: Record<Corner, string> = {
  tl: 'top-0 left-0',
  tr: 'top-0 right-0',
  bl: 'bottom-0 left-0',
  br: 'bottom-0 right-0',
};

/**
 * Gopuram-inspired corner bracket: three stepped tiers, nothing more.
 * Hook: .corner-stroke (pathLength = 1) for the draw-on.
 */
export function CornerFrame({ corner, className = '' }: { corner: Corner; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`pointer-events-none absolute size-9 text-gold md:size-12 ${PLACE[corner]} ${FLIP[corner]} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <path className="corner-stroke" d="M1 47 V1 H47" pathLength={1} />
      <path className="corner-stroke" d="M7 35 V7 H35" pathLength={1} />
      <path className="corner-stroke" d="M13 23 V13 H23" pathLength={1} />
    </svg>
  );
}

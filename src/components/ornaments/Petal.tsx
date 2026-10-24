import type { CSSProperties } from 'react';
import { PETAL } from './paths';

interface PetalProps {
  className?: string;
  style?: CSSProperties;
}

/** A single marigold petal. Variety comes from the caller's rotation, scale and opacity. */
export function Petal({ className = '', style }: PetalProps) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={PETAL} fill="currentColor" />
    </svg>
  );
}

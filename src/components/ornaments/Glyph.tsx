import { useId } from 'react';
import { GLYPH_PETAL } from './paths';

interface GlyphProps {
  /** Centre in the parent SVG's coordinate space. */
  cx: number;
  cy: number;
  size: number;
}

/**
 * Summit glyph: an eight-petalled rosette around a bindu. Rendered as a <g>
 * so it sits inside another SVG (the staircase). Hooks: .glyph-core, .glyph-halo.
 */
export function Glyph({ cx, cy, size }: GlyphProps) {
  const id = `glyph-blur-${useId().replace(/:/g, '')}`;
  const s = size / 80;

  return (
    <g transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${s})`}>
      <defs>
        <filter id={id} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <circle className="glyph-halo" cx="40" cy="40" r="28" filter={`url(#${id})`} style={{ fill: 'var(--color-flame)' }} />
      <g className="glyph-core" stroke="var(--color-gold)" strokeWidth={1.5 / s} fill="none" strokeLinejoin="round">
        <circle cx="40" cy="40" r="37" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={GLYPH_PETAL} transform={`rotate(${i * 45} 40 40)`} />
        ))}
        <circle cx="40" cy="40" r="7" />
        <circle cx="40" cy="40" r="2" style={{ fill: 'var(--color-gold)' }} />
      </g>
    </g>
  );
}

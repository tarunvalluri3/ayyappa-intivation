import { useId } from 'react';
import {
  DIYA_FLAME,
  DIYA_FLAME_CORE,
  DIYA_GLOW,
  DIYA_STROKES,
  DIYA_VIEWBOX,
} from './paths';

interface DiyaProps {
  className?: string;
  /** Run the flame flicker loops. Off for reduced motion. */
  flicker?: boolean;
}

/**
 * Lamp in profile. Animation hooks (all optional, used by the entry timeline):
 *   .diya-body   the lamp itself
 *   .diya-glow   blurred halo (its feGaussianBlur is .diya-blur)
 *   .diya-flame  outer wrapper GSAP scales for the ignition
 * Inside .diya-flame two nested layers carry the CSS flicker (.flick-a, .flick-b).
 */
export function Diya({ className = '', flicker = true }: DiyaProps) {
  const id = `diya-blur-${useId().replace(/:/g, '')}`;

  return (
    <svg
      viewBox={DIYA_VIEWBOX}
      className={`overflow-visible ${flicker ? 'flicker' : ''} ${className}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={id} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur className="diya-blur" stdDeviation="7" />
        </filter>
      </defs>

      <g className="diya-glow">
        <circle
          className="glow-pulse"
          cx={DIYA_GLOW.cx}
          cy={DIYA_GLOW.cy}
          r={DIYA_GLOW.r}
          filter={`url(#${id})`}
          style={{ fill: 'var(--color-flame)', opacity: 0.6 }}
        />
      </g>

      <g className="diya-body" stroke="var(--color-gold)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {DIYA_STROKES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <g className="diya-flame">
        <g className="flick-a">
          <path className="flick-b" d={DIYA_FLAME} style={{ fill: 'var(--color-flame)' }} />
        </g>
        <g className="flick-a" style={{ animationDelay: '-1.3s' }}>
          <path className="flick-b" d={DIYA_FLAME_CORE} style={{ fill: '#f8d9a0' }} />
        </g>
      </g>
    </svg>
  );
}

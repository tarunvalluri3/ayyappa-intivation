import { useId, type ReactNode } from 'react';
import { PADI_STEPS, PADI_WIDTH, padiHeight, padiStepBottom, padiStepPath } from './paths';

interface PadiProps {
  className?: string;
  /** Height of each tread band in viewBox units. */
  stepHeight?: number;
  /** Empty space above the top step (room for the summit glyph). */
  headroom?: number;
  strokeWidth?: number;
  /** Render an unlit lamp in the face of every step. */
  lamps?: boolean;
  children?: ReactNode;
}

const FLAME = 'M0 -3 C-3.4 -6.5 -2.8 -11 0 -15 C2.8 -11 3.4 -6.5 0 -3 Z';
const BOWL = 'M-6.5 -3 Q0 4 6.5 -3 Z';

/**
 * The eighteen holy steps, drawn as a stepped stair (index 0 is the lowest).
 * Hooks: .padi-step (pathLength = 1, ready for stroke-dashoffset draw-on),
 * and with `lamps`: .lamp > .lamp-bowl / .lamp-glow / .lamp-flame.
 */
export function Padi({
  className = '',
  stepHeight = 14,
  headroom = 0,
  strokeWidth = 1.5,
  lamps = false,
  children,
}: PadiProps) {
  const gradient = `padi-glow-${useId().replace(/:/g, '')}`;
  const steps = Array.from({ length: PADI_STEPS }, (_, i) => i);

  return (
    <svg
      viewBox={`0 0 ${PADI_WIDTH} ${padiHeight(stepHeight, headroom)}`}
      className={`overflow-visible ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {lamps && (
        <defs>
          <radialGradient id={gradient}>
            <stop offset="0" stopColor="#e8963c" stopOpacity="0.85" />
            <stop offset="1" stopColor="#e8963c" stopOpacity="0" />
          </radialGradient>
        </defs>
      )}

      <g>
        {steps.map((i) => (
          <path key={i} className="padi-step" d={padiStepPath(i, stepHeight, headroom)} pathLength={1} />
        ))}
      </g>

      {lamps && (
        <g stroke="none">
          {steps.map((i) => (
            <g
              key={i}
              className="lamp"
              data-step={i + 1}
              transform={`translate(${PADI_WIDTH / 2} ${padiStepBottom(i, stepHeight, headroom) - 4})`}
            >
              <circle className="lamp-glow" cx="0" cy="-8" r="11" fill={`url(#${gradient})`} />
              <path className="lamp-bowl" d={BOWL} style={{ fill: 'var(--color-gold)' }} />
              <g className="lamp-flame">
                <g className="flick-a" style={{ animationDelay: `${-(i * 0.37) % 2.9}s` }}>
                  <path className="flick-b" d={FLAME} style={{ fill: 'var(--color-flame)' }} />
                </g>
              </g>
            </g>
          ))}
        </g>
      )}

      {children}
    </svg>
  );
}

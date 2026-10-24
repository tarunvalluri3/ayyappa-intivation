import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { STEP_COUNT } from '../data/event';

/**
 * Eighteen notches that fill with gold as the page is climbed: bottom edge
 * (left to right) on phones, right edge (bottom to top) on larger screens.
 */
export function ProgressRail() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const notches = gsap.utils.toArray<HTMLElement>('i', ref.current);
      const last = notches.map(() => -1);

      const apply = (progress: number) => {
        notches.forEach((notch, i) => {
          const fill = Math.min(1, Math.max(0, progress * STEP_COUNT - i));
          if (fill === last[i]) return;
          last[i] = fill;
          notch.style.setProperty('--f', fill.toFixed(3));
        });
      };

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      apply(0);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="rail" data-rail aria-hidden="true">
      {Array.from({ length: STEP_COUNT }, (_, i) => (
        <i key={i}>
          <b />
        </i>
      ))}
    </div>
  );
}

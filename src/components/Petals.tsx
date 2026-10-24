import { useMemo, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useMotion } from '../hooks/useMotion';
import { Petal } from './ornaments/Petal';

interface PetalSpec {
  left: number;
  size: number;
  opacity: number;
  fall: number;
  drift: number;
  sway: number;
  tilt: number;
}

/** Deterministic spread (golden-ratio sequence) so layout never depends on Math.random. */
const frac = (n: number) => n - Math.floor(n);

function makePetals(): PetalSpec[] {
  const small = window.matchMedia('(max-width: 767px)').matches;
  const count = small ? 5 : 9; // hard caps from the brief
  const [minSize, maxSize] = small ? [10, 18] : [14, 26];

  return Array.from({ length: count }, (_, i) => {
    const r = frac(0.618 * (i + 1) + 0.13);
    const q = frac(0.414 * (i + 2) + 0.37);
    return {
      left: ((i + r * 0.8) / count) * 100,
      size: minSize + q * (maxSize - minSize),
      opacity: 0.12 + frac(0.73 * (i + 1)) * 0.18, // 0.12 – 0.30
      fall: 30 + r * 20,
      drift: 18 + q * 28,
      sway: 5 + r * 4,
      tilt: 30 + q * 40,
    };
  });
}

/**
 * Barely-there ambient fall. Each petal is a tall, click-through wrapper that is
 * translated by percentage of its own height, so the motion is resolution-independent.
 */
export function Petals() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();
  const petals = useMemo(makePetals, []);

  useGSAP(
    () => {
      const wrappers = gsap.utils.toArray<HTMLElement>('.petal-fall');
      const count = wrappers.length;

      wrappers.forEach((wrap, i) => {
        const spec = petals[i];
        const petal = wrap.firstElementChild;
        if (!spec || !petal) return;
        const progress = i / count;

        if (reduced) {
          // Frozen: scatter once, no motion.
          gsap.set(wrap, { yPercent: -100 + progress * 100 + 8 });
          gsap.set(petal, { rotation: spec.tilt * (i % 2 ? 1 : -1) });
          return;
        }

        gsap
          .fromTo(wrap, { yPercent: -100 }, { yPercent: 0, duration: spec.fall, ease: 'none', repeat: -1 })
          .progress(progress);
        gsap.fromTo(
          petal,
          { x: -spec.drift },
          { x: spec.drift, duration: spec.sway, ease: 'sine.inOut', yoyo: true, repeat: -1 },
        ).progress(frac(progress * 3.1));
        gsap.fromTo(
          petal,
          { rotation: -spec.tilt },
          { rotation: spec.tilt, duration: spec.sway * 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1 },
        );
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <div
          key={i}
          className="petal-fall absolute top-0 flex h-[125svh] items-end"
          style={{ left: `${p.left}%` }}
        >
          <Petal className="text-gold" style={{ width: p.size, height: p.size, opacity: p.opacity }} />
        </div>
      ))}
    </div>
  );
}

import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';

/**
 * Thin gold rule, tapered at both ends, with a small diamond at the centre.
 * The only section separator on the page.
 */
export function Divider({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const trigger = { trigger: svg, start: 'top 92%', once: true } as const;

      if (reduced) {
        gsap.from(svg, { opacity: 0, duration: 0.5, scrollTrigger: trigger });
        return;
      }
      const tl = gsap.timeline({ scrollTrigger: trigger, defaults: { ease: 'power2.out' } });
      tl.from('.div-dia', { scale: 0, transformOrigin: '50% 50%', duration: 0.5 })
        .from('.div-l', { scaleX: 0, transformOrigin: '100% 50%', duration: 0.8 }, 0.1)
        .from('.div-r', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.8 }, 0.1);
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 12"
      className={`mx-auto block h-3 w-[min(15rem,70%)] text-gold ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path className="div-l" d="M0 6 L107 5.2 V6.8 Z" fill="currentColor" />
      <path className="div-r" d="M240 6 L133 5.2 V6.8 Z" fill="currentColor" />
      <path className="div-dia" d="M120 1.5 L124.5 6 L120 10.5 L115.5 6 Z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

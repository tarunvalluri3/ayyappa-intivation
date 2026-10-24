import { useRef } from 'react';
import { event } from '../data/event';
import { gsap, useGSAP } from '../lib/gsap';
import { revealRise } from '../lib/reveal';
import { themeShift } from '../lib/theme';
import { useMotion } from '../hooks/useMotion';
import { Diya } from '../components/ornaments/Diya';
import { Divider } from '../components/ornaments/Divider';

/** The page settles back toward lamplight and a single diya is lit. */
export function Closing() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      themeShift({ trigger: el, from: 'ivory', to: 'ink', start: 'top 85%', end: 'top 20%', reduced });

      // Slow fade-in, then the flame catches.
      const lamp = el.querySelector('.closing-lamp');
      const flame = el.querySelector('.diya-flame');
      const glow = el.querySelector('.diya-glow');
      if (lamp && flame && glow) {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: { trigger: lamp, start: 'top 85%', once: true },
        });
        tl.from(lamp, { opacity: 0, y: reduced ? 0 : 14, duration: reduced ? 0.5 : 0.9 });
        if (!reduced) {
          tl.from(flame, { scale: 0, transformOrigin: '50% 100%', duration: 0.7, ease: 'power3.out' }, 0.5).from(
            glow,
            { opacity: 0, duration: 0.9 },
            0.5,
          );
        }
      }

      revealRise(el, reduced);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="flex min-h-svh flex-col items-center justify-center gap-10 px-8 py-32 text-center">
      <Diya className="closing-lamp w-20 md:w-24" flicker={!reduced} />

      <p data-reveal className="max-w-md font-display text-[1.75rem] leading-snug text-balance text-fg md:text-4xl">
        {event.closing}
      </p>

      <Divider className="my-2" />

      <p data-reveal className="font-display text-xl tracking-[0.04em] text-accent md:text-2xl">
        {event.signOff}
      </p>

      <p data-reveal className="eyebrow mt-10">
        {event.invocation}
      </p>
    </section>
  );
}

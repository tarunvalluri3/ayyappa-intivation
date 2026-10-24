import { useRef } from 'react';
import { event } from '../data/event';
import { useGSAP } from '../lib/gsap';
import { revealRise } from '../lib/reveal';
import { themeShift } from '../lib/theme';
import { useMotion } from '../hooks/useMotion';

/** Body line, then the guru, then the host. The page turns from lamplight to daylight here. */
export function Invitation() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      // Dawn breaks in the quiet space above the first line, so no text is ever read mid-transition.
      themeShift({ trigger: el, from: 'ink', to: 'ivory', start: 'top 90%', end: 'top 15%', reduced });
      revealRise(el, reduced, 'top 66%');
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="relative px-8 pb-[24svh] pt-[44svh]">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-[18svh] text-center md:gap-40">
        <p
          data-reveal
          className="font-display text-[1.75rem] leading-[1.3] text-balance text-fg md:text-[2.5rem]"
        >
          {event.bodyLine}
        </p>

        <div data-reveal className="flex flex-col items-center gap-4">
          <p className="eyebrow">{event.guidance.prefix}</p>
          <p className="font-display text-[2rem] leading-tight text-balance text-fg md:text-5xl">
            {event.guidance.name}
          </p>
        </div>

        <div data-reveal className="flex flex-col items-center gap-4">
          <p className="eyebrow">{event.host.prefix}</p>
          <p className="font-display text-[2rem] leading-tight text-balance text-fg md:text-5xl">{event.host.name}</p>
        </div>
      </div>
    </section>
  );
}

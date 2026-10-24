import { useRef } from 'react';
import { event, labels, STEP_COUNT } from '../data/event';
import { gsap, useGSAP } from '../lib/gsap';
import { useMotion } from '../hooks/useMotion';
import { Glyph } from '../components/ornaments/Glyph';
import { Padi } from '../components/ornaments/Padi';
import { PADI_WIDTH } from '../components/ornaments/paths';

const STEP_HEIGHT = 22;
const HEADROOM = 96;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The Ascent. Scroll progress lights a lamp on each of the eighteen steps,
 * lowest first, and the summit glyph glows at the top.
 *  - desktop (>= 1024px): the section is pinned for exactly one screen height
 *  - smaller screens: normal flow, the same timeline scrubbed through the viewport
 *  - reduced motion: everything is simply lit
 */
export function Ascent() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const $ = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, el);

      const lamps = $<SVGGElement>('.lamp');
      const flames = $('.lamp-flame');
      const glows = $('.lamp-glow');
      const bowls = $('.lamp-bowl');
      const core = $('.glyph-core');
      const halo = $('.glyph-halo');
      const caption = $('.ascent-caption');
      const counter = el.querySelector<HTMLElement>('[data-count]');
      const setCount = (n: number) => {
        if (counter) counter.textContent = pad(n);
      };

      if (reduced) {
        setCount(STEP_COUNT);
        gsap.set(halo, { opacity: 0.45 });
        return;
      }

      const mm = gsap.matchMedia();

      const build = (scrollTrigger: ScrollTrigger.Vars) => {
        gsap.set(flames, { scale: 0, transformOrigin: '50% 100%' });
        gsap.set(glows, { opacity: 0 });
        gsap.set(bowls, { opacity: 0.35 });
        gsap.set(core, { opacity: 0.4 });
        gsap.set(halo, { opacity: 0 });
        gsap.set(caption, { opacity: 0, y: 10 });
        setCount(0);

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger,
          onUpdate: () => setCount(Math.min(STEP_COUNT, Math.ceil(tl.time() - 0.001))),
        });
        lamps.forEach((lamp, i) => {
          const q = gsap.utils.selector(lamp);
          tl.to(q('.lamp-flame'), { scale: 1, duration: 1, ease: 'power3.out' }, i)
            .to(q('.lamp-glow'), { opacity: 1, duration: 1 }, i)
            .to(q('.lamp-bowl'), { opacity: 1, duration: 1 }, i);
        });
        tl.to(core, { opacity: 1, duration: 1.5 }, STEP_COUNT)
          .to(halo, { opacity: 0.6, duration: 1.5 }, STEP_COUNT)
          .to(caption, { opacity: 1, y: 0, duration: 1.2 }, STEP_COUNT + 0.3);
      };

      mm.add('(min-width: 1024px)', () => {
        build({
          trigger: el,
          start: 'top top',
          end: '+=100%', // one screen height of pin, no more
          pin: true,
          anticipatePin: 1,
          scrub: 0.5,
        });
      });

      mm.add('(max-width: 1023px)', () => {
        build({
          trigger: el.querySelector('.ascent-stage'),
          start: 'top 72%',
          end: 'bottom 42%',
          scrub: 0.5,
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      className={`relative flex flex-col items-center justify-center px-8 py-24 lg:h-svh lg:py-0 ${reduced ? '' : 'flicker'}`}
    >
      <p className="eyebrow mb-8 lg:mb-6">{labels.steps}</p>

      <div className="ascent-stage text-gold">
        <Padi
          lamps
          stepHeight={STEP_HEIGHT}
          headroom={HEADROOM}
          strokeWidth={1.25}
          className="mx-auto h-auto w-[min(100%,21rem)] lg:h-[min(64svh,600px)] lg:w-auto"
        >
          <Glyph cx={PADI_WIDTH / 2} cy={HEADROOM / 2 + 4} size={68} />
        </Padi>
      </div>

      <div className="ascent-caption mt-8 flex flex-col items-center gap-3 lg:mt-6">
        <p className="eyebrow">{event.invocation}</p>
      </div>
      <p className="mt-4 font-display text-sm tracking-[0.2em] text-fg-dim" aria-hidden="true">
        {labels.step} <span data-count>{pad(reduced ? STEP_COUNT : 0)}</span> / {STEP_COUNT}
      </p>
    </section>
  );
}

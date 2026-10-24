import { useRef } from 'react';
import { event, labels } from '../data/event';
import { gsap, useGSAP } from '../lib/gsap';
import { getLenis } from '../lib/smooth';
import { useMotion } from '../hooks/useMotion';
import { CornerFrame } from '../components/ornaments/CornerFrame';
import { Diya } from '../components/ornaments/Diya';
import { Padi } from '../components/ornaments/Padi';

const SEEN_KEY = 'padi-pooja:entry-seen';
const SKIP_EVENTS = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const;

const entrySeen = (): boolean => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};
const markEntrySeen = (): void => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* private mode: the entry may replay, which is harmless */
  }
};

/** One line of text that rises out of its own clip. */
function MaskLine({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`mask ${className}`}>
      <span className="mask-in">{children}</span>
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  const words = event.title.split(' ');

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const $ = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, el);
      const one = (sel: string) => el.querySelector<HTMLElement>(sel);

      const lamp = one('.lamp-group');
      const cue = one('.cue-line');
      const cueWrap = one('.cue');
      const rail = document.querySelector<HTMLElement>('[data-rail]');
      if (!lamp || !cue || !cueWrap) return;

      const lenis = getLenis();
      const play = !reduced && !entrySeen();

      // The scroll cue: a gold line that draws down, then wipes away, forever.
      const cueLoop = reduced
        ? null
        : gsap
            .timeline({ repeat: -1, paused: true, defaults: { duration: 0.9, ease: 'power2.inOut' } })
            .fromTo(cue, { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, immediateRender: false })
            .set(cue, { transformOrigin: '50% 100%' })
            .to(cue, { scaleY: 0 }, '+=0.15');

      if (!play) {
        // Returning visitor or reduced motion: everything is simply there.
        cueLoop?.play();
        return;
      }

      /* ---------- entry: lock scroll, hide, then build the timeline ---------- */
      lenis?.stop();
      window.scrollTo(0, 0);

      const heroRect = el.getBoundingClientRect();
      const lampRect = lamp.getBoundingClientRect();
      const dy = heroRect.top + heroRect.height / 2 - (lampRect.top + lampRect.height / 2);

      const body = $('.diya-body');
      const flame = $('.diya-flame');
      const glow = $('.diya-glow');
      const blur = $('.diya-blur');
      const wash = $('.wash');
      const padi = $('.padi');
      const steps = $('.padi-step');
      const lines = $('.mask-in');
      const corners = $('.corner-stroke');
      const animated: Element[] = [lamp, ...body, ...flame, ...glow, ...wash, ...padi, ...lines, cueWrap];

      gsap.set(lamp, { y: dy, scale: 2.3, transformOrigin: '50% 50%' });
      gsap.set(body, { opacity: 0, y: 10 });
      gsap.set(flame, { scale: 0, transformOrigin: '50% 100%' });
      gsap.set(glow, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
      gsap.set(blur, { attr: { stdDeviation: 2 } });
      gsap.set(wash, { scale: 0, opacity: 0 });
      gsap.set(padi, { opacity: 1 });
      gsap.set(steps, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(lines, { yPercent: 115 });
      gsap.set(corners, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(cueWrap, { opacity: 0 });
      if (rail) gsap.set(rail, { opacity: 0 });
      gsap.set(animated, { willChange: 'transform, opacity' });

      let finished = false;
      const detach = () => SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip));

      const finish = () => {
        if (finished) return;
        finished = true;
        markEntrySeen();
        detach();
        lenis?.start();
        gsap.set(animated, { clearProps: 'willChange' });
        cueLoop?.play();
      };

      const tl = gsap.timeline({ onComplete: finish });

      // 1  Lamp fades up, unlit.
      tl.to(body, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0)
        // 2  Ignition: the single permitted overshoot, plus a blooming halo and a light wash.
        .to(flame, { scale: 1, duration: 0.7, ease: 'back.out(2.2)' }, 0.4)
        .to(glow, { scale: 1, opacity: 1, duration: 0.7, ease: 'expo.out' }, 0.4)
        .to(blur, { attr: { stdDeviation: 8 }, duration: 0.8, ease: 'expo.out' }, 0.4)
        .to(wash, { scale: 1, opacity: 0.26, duration: 0.9, ease: 'expo.out' }, 0.5)
        // 3  By that light the eighteen steps draw themselves, lowest first.
        .to(steps, { strokeDashoffset: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' }, 1.0)
        // 4  Settle: lamp shrinks and drops into place, steps recede to a watermark.
        .to(lamp, { y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }, 1.75)
        .to(padi, { opacity: 0.08, duration: 0.8, ease: 'power2.out' }, 1.75)
        .to(wash, { opacity: 0.14, duration: 0.8, ease: 'power2.out' }, 1.75)
        // 5  Words rise out of their masks: invocation, lead-in, then the title word by word.
        .to(lines, { yPercent: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 2.0)
        .to(corners, { strokeDashoffset: 0, duration: 0.7, stagger: 0.04, ease: 'power2.out' }, 2.1)
        // 6  Scroll cue and progress rail arrive last.
        .to(cueWrap, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 2.7);
      if (rail) tl.to(rail, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 2.7);

      // Flag the session as soon as the entry has really started (not on the
      // throwaway first pass React StrictMode makes in development).
      tl.call(markEntrySeen, [], 0.15);

      // Any tap, click, key or scroll fast-forwards to the finished state.
      function skip() {
        tl.progress(1, false);
        finish();
      }
      SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { passive: true }));

      // Unmounting mid-entry must never leave scroll locked or content hidden;
      // useGSAP reverts every inline style, this releases the rest.
      return () => {
        detach();
        lenis?.start();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-svh flex-col items-center justify-between overflow-hidden px-8 pb-[max(15svh,7rem)] pt-[16svh] text-center md:pb-[max(12svh,7rem)] md:pt-[14svh]"
    >
      {/* gopuram corner brackets */}
      <div className="pointer-events-none absolute inset-4 md:inset-8" aria-hidden="true">
        <CornerFrame corner="tl" />
        <CornerFrame corner="tr" />
        <CornerFrame corner="bl" />
        <CornerFrame corner="br" />
      </div>

      {/* the eighteen steps, a watermark once the entry has settled */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-gold" aria-hidden="true">
        <Padi className="padi w-[min(125vw,880px)] opacity-[0.08]" stepHeight={14} strokeWidth={0.9} />
      </div>

      <div className="flex max-w-[34rem] flex-col items-center gap-5 md:gap-6">
        <p className="eyebrow">
          <MaskLine>{event.invocation}</MaskLine>
        </p>
        <p className="max-w-[26ch] text-[0.9375rem] leading-relaxed text-balance text-fg-dim md:max-w-[34ch] md:text-base">
          <MaskLine>{event.leadIn}</MaskLine>
        </p>
        <h1 className="mt-3 font-display text-[clamp(3.4rem,17vw,5.5rem)] leading-[0.98] tracking-[0.01em] text-fg lg:text-[6.5rem]">
          <span className="sr-only">{event.title}</span>
          <span aria-hidden="true" className="flex flex-col items-center lg:block">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="lg:inline-block">
                <MaskLine className="lg:inline-block lg:px-[0.14em]">{word}</MaskLine>
              </span>
            ))}
          </span>
        </h1>
      </div>

      {/* lamp + the light it throws */}
      <div className="lamp-group relative size-24 md:size-28" aria-hidden="true">
        <div
          className="wash pointer-events-none absolute left-1/2 top-1/2 size-[110vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14]"
          style={{
            background:
              'radial-gradient(closest-side, rgb(232 150 60 / 0.9), rgb(232 150 60 / 0.35) 38%, transparent 100%)',
          }}
        />
        <Diya className="relative size-full" flicker={!reduced} />
      </div>

      {/* scroll cue */}
      <div className="cue absolute bottom-[4.5svh] left-1/2 h-14 w-px -translate-x-1/2" aria-hidden="true">
        <span className="sr-only">{labels.scroll}</span>
        <div className="cue-line h-full w-px bg-gold" />
      </div>
    </section>
  );
}

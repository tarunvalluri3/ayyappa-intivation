import { gsap, ScrollTrigger } from './gsap';

/** Page "moods". Values are written as rgb() so GSAP can interpolate them. */
const MOODS = {
  ink: { '--page-bg': 'rgb(20,18,16)', '--fg': 'rgb(247,242,232)', '--accent': 'rgb(184,135,43)' },
  // Gold darkens to gold-lo on paper so small caps keep 4.5:1 contrast.
  ivory: { '--page-bg': 'rgb(247,242,232)', '--fg': 'rgb(20,18,16)', '--accent': 'rgb(138,100,32)' },
} as const;

type Mood = keyof typeof MOODS;

/**
 * Text colour must not cross the background through mid-grey at the same time,
 * so foreground/accent flip quickly around the midpoint while the background
 * glides across the full range.
 */
const flip = (p: number): number => Math.min(1, Math.max(0, (p - 0.4) / 0.2));

interface ThemeShift {
  trigger: Element;
  from: Mood;
  to: Mood;
  start: string;
  end: string;
  reduced: boolean;
}

/** Scroll-scrubbed background shift ("dawn"). Call inside useGSAP. */
export function themeShift({ trigger, from, to, start, end, reduced }: ThemeShift): void {
  const root = document.documentElement;
  const a = MOODS[from];
  const b = MOODS[to];

  if (reduced) {
    // No scrubbing: a short cross-fade when the section is crossed.
    const apply = (m: Mood) => gsap.to(root, { ...MOODS[m], duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    ScrollTrigger.create({
      trigger,
      start,
      onEnter: () => apply(to),
      onLeaveBack: () => apply(from),
    });
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger, start, end, scrub: true },
  });
  tl.fromTo(root, { '--page-bg': a['--page-bg'] }, { '--page-bg': b['--page-bg'], immediateRender: false }, 0)
    .fromTo(root, { '--fg': a['--fg'] }, { '--fg': b['--fg'], ease: flip, immediateRender: false }, 0)
    .fromTo(root, { '--accent': a['--accent'] }, { '--accent': b['--accent'], ease: flip, immediateRender: false }, 0);
}

import { gsap } from './gsap';

/**
 * Soft rise-and-fade for every `[data-reveal]` element, each on its own
 * ScrollTrigger. Reduced motion keeps only a short opacity fade.
 * Call inside useGSAP (the context cleans the triggers up).
 */
export function revealRise(scope: Element, reduced: boolean, start = 'top 88%'): void {
  gsap.utils.toArray<HTMLElement>('[data-reveal]', scope).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: reduced ? 0 : 24,
      duration: reduced ? 0.5 : 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start, once: true },
      onStart: () => {
        el.style.willChange = 'transform, opacity';
      },
      onComplete: () => {
        el.style.willChange = '';
      },
    });
  });
}

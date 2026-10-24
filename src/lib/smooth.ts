import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './gsap';

let instance: Lenis | null = null;

/**
 * One animation loop for the whole page: Lenis is driven by GSAP's ticker
 * (autoRaf off) and reports scroll back to ScrollTrigger.
 */
export function initSmoothScroll(): Lenis {
  if (instance) return instance;

  const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  instance = lenis;
  return lenis;
}

/** The active Lenis instance, or null when smooth scrolling is disabled (reduced motion). */
export function getLenis(): Lenis | null {
  return instance;
}

import { useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Read once, outside React, so non-component code (Lenis bootstrap) can share it. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
}

/**
 * Checked once on mount. It is read at the app root and threaded down through
 * MotionContext, so every component agrees on a single answer for the session.
 */
export function useReducedMotion(): boolean {
  const [reduced] = useState(prefersReducedMotion);
  return reduced;
}

/**
 * Raw geometry shared by the React ornaments, the favicon and the OG image
 * script (scripts/make-og.mjs imports this file directly, so keep it free of
 * anything but plain constants and pure functions).
 */

/* ---------------------------------------------------------------- diya --- */
/** Lamp in profile, viewBox 0 0 120 108. Strokes only; the flame is filled separately. */
export const DIYA_VIEWBOX = '0 0 120 108';
export const DIYA_STROKES = [
  'M16 58 H104', // rim
  'M16 58 C18 78 38 91 60 91 C82 91 102 78 104 58', // bowl
  'M17 58 C11 58 6 54 3 46 C9 49 15 50 23 51', // left spout
  'M103 58 C109 58 114 54 117 46 C111 49 105 50 97 51', // right spout
  'M52 58 L54 51 H66 L68 58', // wick cup
  'M46 91 L42 100 H78 L74 91', // stem
  'M36 100 H84', // foot
  'M32 68 Q60 80 88 68', // single engraved line on the bowl
] as const;
export const DIYA_FLAME = 'M60 50 C49 40 52 26 60 10 C68 26 71 40 60 50 Z';
export const DIYA_FLAME_CORE = 'M60 48 C55 42 56 34 60 25 C64 34 65 42 60 48 Z';
export const DIYA_GLOW = { cx: 60, cy: 32, r: 24 } as const;

/* ---------------------------------------------------------------- padi --- */
export const PADI_STEPS = 18;
export const PADI_WIDTH = 360;
const PADI_BASE_WIDTH = 340;
const PADI_TAPER = 13; // width lost per step

/** Total viewBox height for a staircase with the given step height and headroom. */
export const padiHeight = (stepHeight: number, headroom: number): number => headroom + PADI_STEPS * stepHeight + 6;

/** y of the bottom edge of step `i` (0 = lowest). */
export const padiStepBottom = (i: number, stepHeight: number, headroom: number): number =>
  headroom + (PADI_STEPS - i) * stepHeight;

/** One tread plus its two risers; the lowest step is closed into a base. */
export function padiStepPath(i: number, stepHeight: number, headroom: number): string {
  const w = PADI_BASE_WIDTH - i * PADI_TAPER;
  const left = (PADI_WIDTH - w) / 2;
  const right = left + w;
  const bottom = padiStepBottom(i, stepHeight, headroom);
  const top = bottom - stepHeight;
  return `M${left} ${bottom} V${top} H${right} V${bottom}${i === 0 ? ' Z' : ''}`;
}

/* ------------------------------------------------------------- petal etc. */
export const PETAL = 'M0 -10 C6 -6 7 2 0 10 C-7 2 -6 -6 0 -10 Z';

/** Eight-petalled rosette used as the summit glyph, viewBox 0 0 80 80. */
export const GLYPH_PETAL = 'M40 40 C34 30 34 18 40 9 C46 18 46 30 40 40 Z';

/**
 * Generates the static brand assets from the same geometry the page uses:
 *   public/favicon.svg, public/og.svg, public/og.png (1200x630), public/apple-touch-icon.png
 *
 * Text is converted to outlines with opentype.js (using the self-hosted Marcellus
 * font), so the PNG renders identically on any machine without installed fonts.
 *
 *   npm run og
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';
import {
  DIYA_FLAME,
  DIYA_FLAME_CORE,
  DIYA_STROKES,
  PADI_STEPS,
  padiStepPath,
} from '../src/components/ornaments/paths.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => path.join(root, 'public', f);

const INK = '#141210';
const GOLD = '#B8872B';
const IVORY = '#F7F2E8';
const FLAME = '#E8963C';

const fontFile = path.join(root, 'node_modules/@fontsource/marcellus/files/marcellus-latin-400-normal.woff');
const buf = await readFile(fontFile);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

/** Outline `text` as an SVG path, centred on `cx`, baseline at `y`, with letter-spacing. */
function textPath(text, { cx, y, size, tracking = 0, fill }) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(text);
  const advances = glyphs.map((g) => g.advanceWidth * scale + tracking);
  const total = advances.reduce((a, b) => a + b, 0) - tracking;
  let x = cx - total / 2;
  const d = glyphs
    .map((g, i) => {
      const p = g.getPath(x, y, size).toPathData(2);
      x += advances[i];
      return p;
    })
    .join(' ');
  return `<path d="${d}" fill="${fill}"/>`;
}

const diyaGroup = (x, y, scale, { glow = true } = {}) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    ${glow ? `<circle cx="60" cy="32" r="30" fill="${FLAME}" opacity="0.5" filter="url(#blur)"/>` : ''}
    <g fill="none" stroke="${GOLD}" stroke-width="${1.5}" stroke-linecap="round" stroke-linejoin="round">
      ${DIYA_STROKES.map((d) => `<path d="${d}"/>`).join('')}
    </g>
    <path d="${DIYA_FLAME}" fill="${FLAME}"/>
    <path d="${DIYA_FLAME_CORE}" fill="#F8D9A0"/>
  </g>`;

const defs = `<defs><filter id="blur" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="9"/></filter>
<radialGradient id="wash" cx="50%" cy="68%" r="65%"><stop offset="0" stop-color="${FLAME}" stop-opacity="0.22"/><stop offset="1" stop-color="${FLAME}" stop-opacity="0"/></radialGradient></defs>`;

/* ------------------------------------------------------------ favicon --- */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><filter id="blur" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  <rect width="64" height="64" rx="14" fill="${INK}"/>
  ${diyaGroup(5, 8, 0.45)}
</svg>`;
await writeFile(pub('favicon.svg'), favicon);

/* ---------------------------------------------------------------- og ---- */
const W = 1200;
const H = 630;

// the eighteen steps as a faint watermark, centred behind the card
const stepH = 20;
const stairScale = 2.55;
const stairW = 360 * stairScale;
const stairX = (W - stairW) / 2;
const stairY = 78;
const stairs = Array.from({ length: PADI_STEPS }, (_, i) => `<path d="${padiStepPath(i, stepH, 0)}"/>`).join('');

const corner = (x, y, sx, sy) =>
  `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.9">
     <path d="M1 59 V1 H59"/><path d="M9 43 V9 H43"/><path d="M17 29 V17 H29"/></g>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs}
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect width="${W}" height="${H}" fill="url(#wash)"/>
  <g transform="translate(${stairX} ${stairY}) scale(${stairScale})" fill="none" stroke="${GOLD}" stroke-width="0.6" opacity="0.13">${stairs}</g>
  ${corner(36, 36, 1, 1)}${corner(W - 36, 36, -1, 1)}${corner(36, H - 36, 1, -1)}${corner(W - 36, H - 36, -1, -1)}
  ${textPath('SWAMIYE SARANAM AYYAPPA', { cx: W / 2, y: 112, size: 22, tracking: 7, fill: GOLD })}
  ${diyaGroup(W / 2 - 40, 128, 0.66)}
  ${textPath('Ayyappa Padi Pooja', { cx: W / 2, y: 372, size: 104, tracking: 2, fill: IVORY })}
  <path d="M470 408 H590 M610 408 L620 398 L630 408 L620 418 Z M650 408 H730" stroke="${GOLD}" stroke-width="1.5" fill="none"/>
  ${textPath('SUNDAY, 1 NOVEMBER 2026  ·  9:00 AM', { cx: W / 2, y: 478, size: 30, tracking: 5, fill: GOLD })}
  ${textPath('OLD ALWAL, SECUNDERABAD', { cx: W / 2, y: 532, size: 20, tracking: 6, fill: '#B9B2A3' })}
</svg>`;
await writeFile(pub('og.svg'), og);
await sharp(Buffer.from(og)).png({ palette: true, quality: 92, compressionLevel: 9 }).toFile(pub('og.png'));

/* ----------------------------------------------------- apple-touch-icon -- */
await sharp(Buffer.from(favicon.replace('rx="14"', 'rx="0"')), { density: 288 })
  .resize(180, 180)
  .png()
  .toFile(pub('apple-touch-icon.png'));

console.log('Wrote favicon.svg, og.svg, og.png, apple-touch-icon.png to public/');

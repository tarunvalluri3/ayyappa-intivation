import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Open Graph / Twitter image URLs must be absolute for WhatsApp to render the
 * preview card. Resolve the public origin at build time:
 *   1. VITE_SITE_URL (set this once you attach a custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (provided by Vercel during builds)
 *   3. localhost fallback for local dev
 */
function siteUrl(mode: string): string {
  const env = loadEnv(mode, process.cwd(), '');
  const explicit = env.VITE_SITE_URL ?? process.env.VITE_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const raw = explicit ?? (vercel ? `https://${vercel}` : 'http://localhost:5173');
  return raw.replace(/\/+$/, '');
}

function injectSiteUrl(mode: string): Plugin {
  const origin = siteUrl(mode);
  return {
    name: 'inject-site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', origin),
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), injectSiteUrl(mode)],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 400,
  },
}));

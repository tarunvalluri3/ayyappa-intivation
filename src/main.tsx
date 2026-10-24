import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { prefersReducedMotion } from './hooks/useReducedMotion';
import { initSmoothScroll } from './lib/smooth';

/** Fonts are self-hosted, but still gate first render on them so nothing swaps mid-entry. */
async function fontsReady(): Promise<void> {
  const loaded = Promise.all([
    document.fonts.load('1em Marcellus'),
    document.fonts.load('1em "Inter Variable"'),
  ]).then(() => undefined);
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 1500));
  try {
    await Promise.race([loaded, timeout]);
  } catch {
    /* render with fallbacks rather than not at all */
  }
}

async function boot(): Promise<void> {
  if (!prefersReducedMotion()) initSmoothScroll();
  await fontsReady();

  const container = document.getElementById('root');
  if (!container) return;
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void boot();

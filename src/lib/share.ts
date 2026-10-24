import { event } from '../data/event';

/** Touch devices get the native share sheet; desktops go straight to WhatsApp Web. */
const hasNativeShare = (): boolean =>
  typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches;

export async function shareInvitation(): Promise<void> {
  const url = window.location.href;
  const text = `${event.title} — ${event.date}, ${event.time}`;

  if (hasNativeShare()) {
    try {
      await navigator.share({ title: event.title, text, url });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      // Any other failure: fall through to WhatsApp.
    }
  }

  const href = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  window.open(href, '_blank', 'noopener,noreferrer');
}

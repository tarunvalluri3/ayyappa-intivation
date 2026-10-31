import { useRef, type ReactNode } from 'react';
import { event, labels, venue } from '../data/event';
import { gsap, useGSAP } from '../lib/gsap';
import { revealRise } from '../lib/reveal';
import { bindNumbers } from '../lib/typography';
import { useMotion } from '../hooks/useMotion';
import { Countdown } from '../components/Countdown';
import { CalendarIcon, LampClockIcon, PinIcon } from '../components/icons';


function Card({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="detail-card hairline-border flex flex-col items-center gap-4 bg-ivory-dim/40 px-6 py-9 text-center">
      <span className="text-accent">{icon}</span>
      <p className="eyebrow">{label}</p>
      <p className="font-display text-[1.65rem] leading-snug text-balance text-fg">{bindNumbers(value)}</p>
    </div>
  );
}

/** Date, time and venue on hairline cards, then the countdown. */
export function Details() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // Staggered mask-wipe: each card is uncovered from the top down.
      gsap.from('.detail-card', {
        ...(reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }),
        duration: reduced ? 0.5 : 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.detail-grid', start: 'top 82%', once: true },
      });
      revealRise(el, reduced);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="detail-grid grid gap-3 md:grid-cols-3 md:gap-4">
          <Card icon={<CalendarIcon className="size-7" />} label={labels.date} value={event.date} />
          <Card icon={<LampClockIcon className="size-7" />} label={labels.time} value={event.time} />
          <Card icon={<PinIcon className="size-7" />} label={labels.venue} value={venue.label} />
        </div>

        <div data-reveal className="mt-16 md:mt-20">
          <Countdown />
        </div>
      </div>
    </section>
  );
}

import { Fragment, useRef } from 'react';
import { event } from '../data/event';
import { useGSAP } from '../lib/gsap';
import { revealRise } from '../lib/reveal';
import { useMotion } from '../hooks/useMotion';
import { ActionButtons } from '../components/ActionButtons';

const segments = event.address.split(', ');

/** Address block, then Maps / Calendar / Share. */
export function Venue() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (root.current) revealRise(root.current, reduced);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="px-6 py-20 text-center md:px-10 md:py-28">
      <address data-reveal className="mx-auto flex max-w-lg flex-col items-center gap-5 not-italic">
        <p className="eyebrow">{event.venueLabel}</p>
        <p className="font-display text-[1.6rem] leading-snug text-balance text-fg md:text-3xl">
          {segments.map((seg, i) => (
            <Fragment key={seg}>
              <span className="inline-block">{i < segments.length - 1 ? `${seg},` : seg}</span>{' '}
            </Fragment>
          ))}
        </p>
      </address>

      <div data-reveal className="mt-12 md:mt-14">
        <ActionButtons />
      </div>
    </section>
  );
}

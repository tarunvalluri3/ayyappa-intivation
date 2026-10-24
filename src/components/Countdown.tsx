import { useEffect, useState } from 'react';
import { event, labels } from '../data/event';
import { remaining, type Remaining } from '../lib/countdown';

const pad = (n: number) => String(n).padStart(2, '0');

const same = (a: Remaining, b: Remaining) =>
  a.over === b.over && a.days === b.days && a.hours === b.hours && a.minutes === b.minutes;

/** Days / hours / minutes to the ceremony, in IST. Swaps to the closing line afterwards. */
export function Countdown() {
  const [time, setTime] = useState<Remaining>(() => remaining());

  useEffect(() => {
    const tick = () => setTime((prev) => {
      const next = remaining();
      return same(prev, next) ? prev : next;
    });
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (time.over) {
    return (
      <p className="fade-in mx-auto max-w-md text-center font-display text-2xl leading-snug text-balance md:text-3xl">
        {event.closing}
      </p>
    );
  }

  const cells: ReadonlyArray<readonly [string, string]> = [
    [pad(time.days), labels.days],
    [pad(time.hours), labels.hours],
    [pad(time.minutes), labels.minutes],
  ];

  return (
    <div
      className="fade-in mx-auto grid w-full max-w-sm grid-cols-3"
      role="group"
      aria-label={`${labels.countdown}: ${time.days} ${labels.days}, ${time.hours} ${labels.hours}, ${time.minutes} ${labels.minutes}`}
    >
      {cells.map(([value, label], i) => (
        <div
          key={label}
          className={`flex flex-col items-center gap-2 px-2 ${i > 0 ? 'border-l border-gold/40' : ''}`}
          aria-hidden="true"
        >
          <span className="font-display text-5xl leading-none tabular-nums md:text-6xl">{value}</span>
          <span className="eyebrow">{label}</span>
        </div>
      ))}
    </div>
  );
}

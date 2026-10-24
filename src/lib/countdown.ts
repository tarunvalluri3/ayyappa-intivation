import { event } from '../data/event';

/**
 * `startsAt` carries an explicit +05:30 offset, so it is one absolute instant:
 * the difference to `Date.now()` is identical on every device time zone.
 */
const STARTS_AT_MS = Date.parse(event.startsAt);

export interface Remaining {
  over: boolean;
  days: number;
  hours: number;
  minutes: number;
}

export function remaining(now: number = Date.now()): Remaining {
  const diff = STARTS_AT_MS - now;
  if (diff <= 0) return { over: true, days: 0, hours: 0, minutes: 0 };
  const totalMinutes = Math.floor(diff / 60_000);
  return {
    over: false,
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

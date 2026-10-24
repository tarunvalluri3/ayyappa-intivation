import type { ReactNode } from 'react';
import { event, labels } from '../data/event';
import { downloadIcs } from '../lib/ics';
import { shareInvitation } from '../lib/share';
import { CalendarPlusIcon, PinIcon, ShareIcon } from './icons';

const base =
  'hairline-border group flex min-h-[4.5rem] flex-1 basis-0 flex-col items-center justify-center gap-2 px-2 py-4 ' +
  'text-center text-[0.6875rem] font-medium uppercase leading-tight tracking-[0.14em] text-fg ' +
  'transition-colors duration-300 hover:bg-gold/10 active:bg-gold/15 md:min-h-[5rem] md:flex-row md:gap-3 md:px-6 md:text-xs';

function Label({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <>
      <span className="text-accent">{icon}</span>
      <span>{children}</span>
    </>
  );
}

/** Three ghost buttons: Maps, Calendar (.ics) and Share. */
export function ActionButtons() {
  return (
    <div className="mx-auto flex w-full max-w-2xl gap-2 md:gap-3">
      <a className={base} href={event.mapUrl} target="_blank" rel="noopener noreferrer">
        <Label icon={<PinIcon className="size-6" />}>{labels.openMaps}</Label>
      </a>
      <button type="button" className={base} onClick={downloadIcs}>
        <Label icon={<CalendarPlusIcon className="size-6" />}>{labels.addCalendar}</Label>
      </button>
      <button type="button" className={base} onClick={() => void shareInvitation()}>
        <Label icon={<ShareIcon className="size-6" />}>{labels.share}</Label>
      </button>
    </div>
  );
}

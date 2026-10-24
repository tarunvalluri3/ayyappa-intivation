/** Single source of truth for everything printed on the invitation. */
export const event = {
  invocation: 'Swamiye Saranam Ayyappa',
  leadIn: 'With the blessings of Lord Ayyappa, we cordially invite you to',
  title: 'Ayyappa Padi Pooja',
  bodyLine: 'We seek your gracious presence and blessings for the Ayyappa Padi Pooja',
  guidance: { prefix: 'under the guidance of', name: 'Shri Anandam Guruswamy' },
  host: { prefix: 'by', name: 'Vaka Rugved' },
  date: 'Sunday, 1 November 2026',
  time: '9:00 AM',
  venueLabel: 'At our residence',
  address: '1-5-417/1, Near St Alphonsus School, Surya Nagar, Old Alwal, Secunderabad',
  mapUrl: 'https://maps.app.goo.gl/utjZhFsHNG83dPu89?g_st=ic',
  closing: 'Your presence will make our prayers more special.',
  signOff: 'With love & devotion',

  /** Absolute instant of the ceremony. The +05:30 offset pins it to IST, so the
   *  countdown and the calendar file are correct on any device time zone. */
  startsAt: '2026-11-01T09:00:00+05:30',
  timeZone: 'Asia/Kolkata',
  /** Not stated on the invitation; used only for the .ics end time. */
  durationMinutes: 180,
} as const;

/** Small interface labels (not invitation copy). */
export const labels = {
  steps: 'The Eighteen Steps',
  step: 'Step',
  date: 'Date',
  time: 'Time',
  venue: 'Venue',
  countdown: 'Countdown',
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  openMaps: 'Open in Maps',
  addCalendar: 'Add to Calendar',
  share: 'Share',
  scroll: 'Scroll',
} as const;

export const STEP_COUNT = 18;

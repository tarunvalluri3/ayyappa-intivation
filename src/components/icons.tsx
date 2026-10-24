import type { ReactNode } from 'react';

/** Hand-drawn line icons: 24px grid, 1.5px stroke, matching the ornaments. */
function Icon({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

type IconProps = { className?: string };

export const CalendarIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M4 6.5h16V20H4z" />
    <path d="M4 11h16" />
    <path d="M8.5 3.5v5M15.5 3.5v5" />
    <path d="M8 14.5h2M14 14.5h2M8 17.5h2" />
  </Icon>
);

/** A lamp-clock: a clock face standing on a lamp foot, with a small flame above. */
export const LampClockIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 2.2c-1.5 1.4-1.5 2.7 0 3.8 1.5-1.1 1.5-2.4 0-3.8z" />
    <circle cx="12" cy="13" r="6.3" />
    <path d="M12 9.8V13l2.3 1.4" />
    <path d="M9 21.2h6M12 19.3v1.9" />
  </Icon>
);

export const PinIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 21.5s-6.5-5.4-6.5-11a6.5 6.5 0 0 1 13 0c0 5.6-6.5 11-6.5 11z" />
    <circle cx="12" cy="10.3" r="2.3" />
  </Icon>
);

export const CalendarPlusIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M4 6.5h16V20H4z" />
    <path d="M4 11h16" />
    <path d="M8.5 3.5v5M15.5 3.5v5" />
    <path d="M12 13.2v5M9.5 15.7h5" />
  </Icon>
);

export const ShareIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 15.5V3.5M8 7.3l4-3.8 4 3.8" />
    <path d="M5.5 12v8h13v-8" />
  </Icon>
);

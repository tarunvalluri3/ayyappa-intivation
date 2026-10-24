/** Waves Web Studio mark: one red node feeding three. Traced as inline SVG. */
function WavesMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 170" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.9">
        <path d="M110 28 26 146" />
        <path d="M110 28V146" />
        <path d="M110 28 194 146" />
      </g>
      <g fill="currentColor">
        <circle cx="26" cy="146" r="12" />
        <circle cx="110" cy="146" r="12" />
        <circle cx="194" cy="146" r="12" />
      </g>
      <circle cx="110" cy="28" r="17" fill="#dc2626" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="flex justify-center px-6 pb-14 pt-4 md:pb-10">
      <a
        href="https://www.waveswebstudio.in"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 text-[0.6875rem] tracking-[0.12em] text-fg-dim transition-colors duration-300 hover:text-fg"
      >
        <WavesMark className="h-4 w-auto text-fg-dim transition-colors duration-300 group-hover:text-fg" />
        <span>
          Made by <span className="font-medium text-fg">Waves Web Studio</span>
        </span>
      </a>
    </footer>
  );
}

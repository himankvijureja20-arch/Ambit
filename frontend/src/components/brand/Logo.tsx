interface LogoProps {
  /** Font size of the wordmark in pixels */
  size?: number;
  /** Render on a dark background (white text) */
  onDark?: boolean;
  /** Show the navy "A" tile before the wordmark */
  withTile?: boolean;
  className?: string;
}

function AmbitMark({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      className="shrink-0 drop-shadow-sm"
    >
      <path d="M25 106 L57 22" stroke="#16283D" strokeWidth="26" strokeLinecap="round" />
      <path d="M66 40 L88 106" stroke="#36754D" strokeWidth="24" strokeLinecap="round" />
      <path
        d="M36 72 C58 88 82 66 76 44"
        stroke="#36754D"
        strokeWidth="15"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="97" cy="26" r="11" fill="#36754D" />
    </svg>
  );
}

/**
 * Ambit brand logo — the "A" + orbit-dot mark alongside a Montserrat Bold wordmark.
 */
export default function Logo({
  size = 24,
  onDark = false,
  withTile = false,
  className = '',
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {withTile && <AmbitMark size={size * 1.7} />}
      <span
        className={`font-display font-bold leading-none tracking-tight ${
          onDark ? 'text-white' : 'text-navy-950'
        }`}
        style={{ fontSize: size }}
      >
        Ambit
      </span>
    </span>
  );
}

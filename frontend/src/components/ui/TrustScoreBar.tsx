interface TrustScoreBarProps {
  score: number;
  label?: string;
  size?: 'lg' | 'md' | 'sm';
  onDark?: boolean;
}

export default function TrustScoreBar({
  score,
  label = 'Trust Score',
  size = 'md',
  onDark = false,
}: TrustScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const heightClasses = {
    lg: 'h-3',
    md: 'h-2.5',
    sm: 'h-2',
  };

  const getColor = (s: number) => {
    if (s >= 80) return 'bg-primary';
    if (s >= 60) return 'bg-amber';
    return 'bg-danger';
  };

  return (
    <div>
      {label && (
        <p
          className={`mb-2 text-xs font-semibold uppercase tracking-wide ${
            onDark ? 'text-white/60' : 'text-ink-tertiary'
          }`}
        >
          {label}
        </p>
      )}
      <div
        className={`w-full overflow-hidden rounded-full ${heightClasses[size]} ${
          onDark ? 'bg-white/20' : 'bg-line/30'
        }`}
      >
        <div
          className={`h-full transition-all duration-300 ${getColor(clampedScore)}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
      <p className={`mt-1 text-xs font-semibold ${onDark ? 'text-white/80' : 'text-ink-secondary'}`}>
        {clampedScore} / 100
      </p>
    </div>
  );
}

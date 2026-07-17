import { ReactNode } from 'react';

interface SegmentedControlProps {
  options: Array<{ value: string; label: ReactNode }>;
  value: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-app p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            value === option.value
              ? 'bg-surface text-navy-950 shadow-card'
              : 'text-ink-secondary hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

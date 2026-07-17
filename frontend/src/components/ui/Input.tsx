import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-ink mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-lg border-2 border-line bg-surface text-ink placeholder-ink-tertiary transition-colors focus:border-primary focus:outline-none ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs font-semibold text-danger">{error}</p>
      )}
    </div>
  );
}

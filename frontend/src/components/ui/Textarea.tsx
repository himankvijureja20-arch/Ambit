import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-ink mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg border-2 border-line bg-surface text-ink placeholder-ink-tertiary transition-colors focus:border-primary focus:outline-none resize-none ${error ? 'border-danger' : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs font-semibold text-danger">{error}</p>
      )}
    </div>
  );
}

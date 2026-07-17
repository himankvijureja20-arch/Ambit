import { ReactNode } from 'react';

interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function SectionHeader({ children, className = '' }: SectionHeaderProps) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-wider text-ink-tertiary ${className}`}
    >
      {children}
    </p>
  );
}

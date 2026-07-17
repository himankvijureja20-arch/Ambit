import { ReactNode } from 'react';

type BadgeStatus = 'verified' | 'priority' | 'urgent' | 'active';

interface BadgeProps {
  status: BadgeStatus;
  children: ReactNode;
  className?: string;
}

const statusClasses: Record<BadgeStatus, string> = {
  verified: 'bg-sage-bg text-sage-text',
  priority: 'bg-amber-bg text-amber-text',
  urgent: 'bg-amber-bg text-amber-text',
  active: 'bg-info-soft text-info-text',
};

export default function Badge({ status, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses[status]} ${className}`}
    >
      {children}
    </span>
  );
}

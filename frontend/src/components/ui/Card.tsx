import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-line bg-surface shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

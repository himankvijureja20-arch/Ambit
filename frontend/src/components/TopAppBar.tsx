import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './brand/Logo';

interface TopAppBarProps {
  title?: string;
  showLogo?: boolean;
  actions?: ReactNode;
  backTo?: string;
}

export default function TopAppBar({
  title,
  showLogo = true,
  actions,
  backTo,
}: TopAppBarProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-surface/95 shadow-card backdrop-blur">
      <div className="mx-auto flex max-w-mobile items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          {backTo ? (
            <button
              onClick={() => navigate(backTo)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy-950 hover:bg-line-subtle transition-colors"
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            showLogo && <Logo size={24} />
          )}
          {title && <h1 className="font-display text-lg font-semibold text-navy-950">{title}</h1>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div className="h-[3px] bg-gradient-to-r from-primary via-primary-600 to-navy-900" />
    </header>
  );
}

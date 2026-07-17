import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'lg' | 'md' | 'sm';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary-600 to-primary text-white hover:brightness-110 shadow-cta hover:shadow-raised',
    secondary: 'bg-gradient-to-r from-navy-950 to-navy-900 text-white hover:brightness-125',
    ghost: 'border-2 border-navy-900 text-navy-900 hover:bg-navy-900/5',
    accent:
      'bg-gradient-to-r from-olive-dark to-olive text-white hover:brightness-110 shadow-cta hover:shadow-raised',
  };

  const sizeClasses = {
    lg: 'px-6 py-3.5 text-lg font-semibold rounded-xl',
    md: 'px-5 py-2.5 text-base font-semibold rounded-lg',
    sm: 'px-3 py-1.5 text-sm font-semibold rounded-md',
  };

  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 font-display transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && !loading && <span className="flex items-center">{icon}</span>}
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

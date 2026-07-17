interface AvatarProps {
  src?: string;
  initials?: string;
  size?: 'lg' | 'md' | 'sm';
  className?: string;
  title?: string;
  onDark?: boolean;
}

const sizeClasses = {
  lg: 'h-12 w-12 text-base',
  md: 'h-10 w-10 text-sm',
  sm: 'h-8 w-8 text-xs',
};

export default function Avatar({
  src,
  initials = '?',
  size = 'md',
  className = '',
  title,
  onDark = false,
}: AvatarProps) {
  const toneClasses = onDark
    ? 'bg-white/20 text-white ring-2 ring-white/30'
    : 'bg-primary/10 text-primary';
  return (
    <div
      title={title}
      className={`flex items-center justify-center rounded-full font-semibold ${toneClasses} ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt="Avatar" className="h-full w-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

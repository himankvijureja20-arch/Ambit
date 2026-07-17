import { ReactNode } from 'react';

type TileColor = 'sage' | 'amber' | 'info' | 'primary' | 'danger';

interface IconTileProps {
  icon: ReactNode;
  color?: TileColor;
  size?: 'lg' | 'md' | 'sm';
}

const colorClasses: Record<TileColor, string> = {
  sage: 'bg-sage-bg',
  amber: 'bg-amber-bg',
  info: 'bg-info-bg',
  primary: 'bg-primary/10',
  danger: 'bg-danger-bg',
};

const sizeClasses = {
  lg: 'h-16 w-16 text-2xl',
  md: 'h-12 w-12 text-xl',
  sm: 'h-10 w-10 text-lg',
};

export default function IconTile({
  icon,
  color = 'sage',
  size = 'md',
}: IconTileProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {icon}
    </div>
  );
}

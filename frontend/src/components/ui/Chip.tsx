interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: string;
  disabled?: boolean;
}

export default function Chip({ label, selected = false, onClick, icon, disabled = false }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all select-none
        ${selected
          ? 'bg-primary text-white border-primary shadow-cta scale-[1.03]'
          : 'bg-surface text-ink-secondary border-line hover:border-primary/50 hover:text-ink'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      {label}
    </button>
  );
}

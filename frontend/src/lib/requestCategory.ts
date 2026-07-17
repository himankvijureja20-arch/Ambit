type TileColor = 'sage' | 'amber' | 'info' | 'primary' | 'danger';

export interface RequestCategoryDef {
  value: string;
  icon: string;
  description: string;
  color: TileColor;
}

export const REQUEST_CATEGORIES: RequestCategoryDef[] = [
  { value: 'Maintenance', icon: '🧰', description: 'Fixing, repairs, and technical help.', color: 'info' },
  { value: 'Errand', icon: '🛒', description: 'Deliveries, pick-ups, or grocery help.', color: 'info' },
  { value: 'Tool Share', icon: '🔧', description: 'Borrow or lend household items.', color: 'info' },
  { value: 'Pet Care', icon: '🐾', description: 'Walking, feeding, or pet-sitting.', color: 'info' },
  { value: 'Security Alert', icon: '🛡️', description: 'Safety concerns needing quick attention.', color: 'amber' },
  { value: 'Social & Events', icon: '🎉', description: 'Get-togethers and one-off plans.', color: 'sage' },
  { value: 'Other', icon: '⭐', description: 'Anything else your neighbors can help with.', color: 'info' },
];

const FALLBACK: RequestCategoryDef = REQUEST_CATEGORIES[REQUEST_CATEGORIES.length - 1];

export function getRequestCategoryStyle(category: string | null | undefined): RequestCategoryDef {
  if (!category) return FALLBACK;
  return REQUEST_CATEGORIES.find((c) => c.value === category) || FALLBACK;
}

export const URGENCY_LABELS: Record<string, string> = {
  normal: 'Low (Within 48h)',
  high: 'Standard (Same day)',
  urgent: 'High (ASAP)',
};

export const URGENCY_SHORT_LABELS: Record<string, string> = {
  normal: 'Low',
  high: 'Standard',
  urgent: 'High',
};

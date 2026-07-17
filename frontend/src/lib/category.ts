type TileColor = 'sage' | 'amber' | 'info' | 'primary' | 'danger';

const CATEGORY_STYLES: Record<string, { icon: string; color: TileColor }> = {
  Sports: { icon: '🏓', color: 'primary' },
  Fitness: { icon: '🏋️', color: 'danger' },
  'Arts & Crafts': { icon: '🎨', color: 'amber' },
  'Food & Cooking': { icon: '🍳', color: 'amber' },
  'Books & Learning': { icon: '📚', color: 'info' },
  Music: { icon: '🎸', color: 'sage' },
  Games: { icon: '♟️', color: 'primary' },
  Outdoors: { icon: '🌳', color: 'sage' },
  Other: { icon: '⭐', color: 'info' },
};

const FALLBACK = { icon: '🔵', color: 'primary' as TileColor };

export function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] || FALLBACK;
}

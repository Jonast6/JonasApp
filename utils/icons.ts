/**
 * Maps utensil names to emoji icons
 */
export function getUtensilIcon(name: string): string {
  const normalized = name.toLowerCase().trim();
  
  if (normalized.includes('ball')) return '⚽';
  if (normalized.includes('leibchen')) return '🦺';
  if (normalized.includes('schlüssel') || normalized.includes('schluessel')) return '🔑';
  if (normalized.includes('pumpe')) return '🎈';
  
  // Default icon for unknown utensils
  return '📦';
}

/**
 * Format date to German locale
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Get weekday name in German
 */
export function getWeekdayName(weekday: number): string {
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  return days[weekday] || '';
}

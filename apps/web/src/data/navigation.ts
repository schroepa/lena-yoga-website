/**
 * Navigation der Seite. Sie steht hier im Code und wird per Pull Request geändert.
 * Die Seiten selbst entstehen in den nächsten Schritten.
 */
export interface Link {
  label: string;
  href: string;
}

export const hauptnavigation: readonly Link[] = [
  { label: 'Yoga entdecken', href: '/yoga-entdecken' },
  { label: 'Kurse', href: '/kurse' },
  { label: 'Meditation', href: '/meditation' },
  { label: 'Gedanken', href: '/gedanken' },
  { label: 'Lena', href: '/lena' },
];

export const servicenavigation: readonly Link[] = [
  { label: 'Kurse', href: '/kurse' },
  { label: 'Meditation', href: '/meditation' },
  { label: 'Gedanken', href: '/gedanken' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
];

/** Hauptaktion. Führt vorerst zur Kursübersicht, später zur Buchung bei Sophies Safe Space. */
export const hauptaktion: Link = { label: 'Probestunde buchen', href: '/kurse' };

/** Ist der Link die aktuelle Seite? Unterseiten zählen mit (zum Beispiel /kurse/online). */
export function istAktuell(pfad: string, href: string): boolean {
  const sauber = (p: string): string => (p.length > 1 ? p.replace(/\/+$/, '') : p);
  const a = sauber(pfad);
  const b = sauber(href);
  return a === b || a.startsWith(`${b}/`);
}

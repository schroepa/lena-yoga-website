/** Zugriff auf die Inhalte im Repository. Wird nur beim Build der Seite benutzt. */
import { getCollection } from 'astro:content';

import { sortiereKurse, type Kurs } from './kurse';

export async function ladeKurse(): Promise<Kurs[]> {
  const eintraege = await getCollection('kurse');
  return sortiereKurse(eintraege.map((e) => e.data));
}

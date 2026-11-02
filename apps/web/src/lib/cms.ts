/**
 * Zugriff auf die Inhalte im CMS (Payload). Wird nur beim Build der Seite benutzt:
 * Die fertige Seite ist statisch und spricht zur Laufzeit nie mit dem CMS.
 *
 * - Ist CMS_URL gesetzt, werden veröffentlichte Inhalte über die öffentliche REST-Schnittstelle geladen.
 * - Ist CMS_URL nicht gesetzt (lokal, CI), kommen Beispieldaten aus src/data/fixtures.
 * - Alle Antworten werden geprüft. Stimmt etwas nicht, bricht der Build ab. Die alte Seite bleibt dann online.
 */
import { z } from 'zod';

import kurseFixture from '../data/fixtures/kurse.json';

export const wochentage = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'] as const;

export const kursSchema = z.object({
  id: z.union([z.string(), z.number()]),
  titel: z.string().min(1),
  ort: z.enum(['online', 'studio']),
  wochentag: z.enum(wochentage),
  uhrzeit: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  dauerMinuten: z.number().int().positive(),
  beschreibung: z.string(),
  buchungslink: z.url({ protocol: /^https$/ }),
});

export type Kurs = z.infer<typeof kursSchema>;

const listeSchema = z.object({ docs: z.array(kursSchema) });

/** Sortiert nach Wochentag, dann nach Uhrzeit. */
export function sortiereKurse(kurse: readonly Kurs[]): Kurs[] {
  return [...kurse].sort(
    (a, b) =>
      wochentage.indexOf(a.wochentag) - wochentage.indexOf(b.wochentag) ||
      a.uhrzeit.localeCompare(b.uhrzeit),
  );
}

async function ladeJson(url: string, versuche = 3): Promise<unknown> {
  let letzterFehler: unknown;
  for (let i = 1; i <= versuche; i += 1) {
    try {
      const antwort = await fetch(url, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!antwort.ok) throw new Error(`HTTP ${String(antwort.status)} für ${url}`);
      return await antwort.json();
    } catch (fehler) {
      letzterFehler = fehler;
      if (i < versuche) await new Promise((r) => setTimeout(r, 500 * i));
    }
  }
  throw new Error(
    `CMS nicht erreichbar: ${letzterFehler instanceof Error ? letzterFehler.message : 'unbekannter Fehler'}`,
  );
}

export async function ladeKurse(): Promise<Kurs[]> {
  const basis = process.env['CMS_URL'];
  const rohdaten = basis
    ? await ladeJson(`${basis.replace(/\/$/, '')}/api/kurse?limit=100&depth=0`)
    : kurseFixture;
  return sortiereKurse(listeSchema.parse(rohdaten).docs);
}

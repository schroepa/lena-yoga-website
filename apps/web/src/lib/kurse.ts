/**
 * Schema und Hilfen für die Kurse. Die Kurse liegen als Dateien in src/content/kurse (eine Datei pro Kurs).
 * Beim Build wird jede Datei gegen dieses Schema geprüft. Stimmt etwas nicht, bricht der Build ab
 * und die alte Seite bleibt online.
 */
import { z } from 'astro/zod';

export const wochentage = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'] as const;

export const kursSchema = z.object({
  titel: z.string().min(1),
  ort: z.enum(['online', 'studio']),
  wochentag: z.enum(wochentage),
  uhrzeit: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Uhrzeit im Format HH:MM, zum Beispiel 18:30'),
  dauerMinuten: z.number().int().positive(),
  beschreibung: z.string(),
  buchungslink: z.url({ protocol: /^https$/ }),
});

export type Wochentag = (typeof wochentage)[number];
export type Kurs = z.infer<typeof kursSchema>;

/** Sortiert nach Wochentag, dann nach Uhrzeit. */
export function sortiereKurse(kurse: readonly Kurs[]): Kurs[] {
  return [...kurse].sort(
    (a, b) =>
      wochentage.indexOf(a.wochentag) - wochentage.indexOf(b.wochentag) ||
      a.uhrzeit.localeCompare(b.uhrzeit),
  );
}

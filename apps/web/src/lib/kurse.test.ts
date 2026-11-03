import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { kursSchema, sortiereKurse, type Wochentag } from './kurse';

const ordner = fileURLToPath(new URL('../content/kurse/', import.meta.url));
const dateien = readdirSync(ordner).filter((d) => d.endsWith('.json'));

describe('Kurs-Dateien in src/content/kurse', () => {
  it('es gibt mindestens eine', () => {
    expect(dateien.length).toBeGreaterThan(0);
  });

  it.each(dateien)('%s entspricht dem Schema', (datei) => {
    const inhalt: unknown = JSON.parse(readFileSync(ordner + datei, 'utf8'));
    expect(() => kursSchema.parse(inhalt)).not.toThrow();
  });
});

describe('kursSchema', () => {
  const gueltig = {
    titel: 'Sanft ankommen',
    ort: 'online',
    wochentag: 'mo',
    uhrzeit: '18:30',
    dauerMinuten: 60,
    beschreibung: 'Ein ruhiger Einstieg.',
    buchungslink: 'https://example.com/buchen',
  };

  it('akzeptiert einen gültigen Kurs', () => {
    expect(kursSchema.parse(gueltig).titel).toBe('Sanft ankommen');
  });

  it.each([
    ['unsichere Buchungsadresse', { buchungslink: 'http://example.com' }],
    ['keine Adresse', { buchungslink: 'nicht-im-netz' }],
    ['falsche Uhrzeit', { uhrzeit: '25:00' }],
    ['unbekannter Wochentag', { wochentag: 'xx' }],
    ['unbekannter Ort', { ort: 'draussen' }],
    ['Dauer null', { dauerMinuten: 0 }],
    ['leerer Titel', { titel: '' }],
  ])('lehnt ab: %s', (_name, abweichung) => {
    expect(() => kursSchema.parse({ ...gueltig, ...abweichung })).toThrow();
  });
});

describe('sortiereKurse', () => {
  const kurs = (wochentag: Wochentag, uhrzeit: string) =>
    kursSchema.parse({
      titel: 'x',
      ort: 'online',
      wochentag,
      uhrzeit,
      dauerMinuten: 60,
      beschreibung: '',
      buchungslink: 'https://example.com',
    });

  it('sortiert nach Wochentag und Uhrzeit', () => {
    const sortiert = sortiereKurse([kurs('mi', '09:00'), kurs('mo', '19:00'), kurs('mo', '08:00')]);
    expect(sortiert.map((k) => `${k.wochentag} ${k.uhrzeit}`)).toEqual([
      'mo 08:00',
      'mo 19:00',
      'mi 09:00',
    ]);
  });

  it('verändert die Eingabe nicht', () => {
    const eingabe = [kurs('so', '10:00'), kurs('mo', '10:00')];
    const kopie = [...eingabe];
    sortiereKurse(eingabe);
    expect(eingabe).toEqual(kopie);
  });
});

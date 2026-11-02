import { describe, expect, it } from 'vitest';

import { kuerzeBeschreibung } from './seo';

describe('kuerzeBeschreibung', () => {
  it('lässt kurze Texte unverändert', () => {
    expect(kuerzeBeschreibung('Kurz und gut.')).toBe('Kurz und gut.');
  });

  it('entfernt doppelte Leerzeichen und Zeilenumbrüche', () => {
    expect(kuerzeBeschreibung('Ein   Satz\nmit  Lücken.')).toBe('Ein Satz mit Lücken.');
  });

  it('schneidet an einer Wortgrenze und hängt eine Ellipse an', () => {
    const ergebnis = kuerzeBeschreibung('Das ist ein langer Satz über Yoga und Atem', 20);
    expect(ergebnis.length).toBeLessThanOrEqual(20);
    expect(ergebnis.endsWith('…')).toBe(true);
    expect(ergebnis).not.toMatch(/\s…$/);
  });
});

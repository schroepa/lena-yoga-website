import { describe, expect, it } from 'vitest';

import { hauptnavigation, istAktuell } from './navigation';

describe('istAktuell', () => {
  it('erkennt die gleiche Seite', () => {
    expect(istAktuell('/kurse', '/kurse')).toBe(true);
  });

  it('ignoriert einen abschließenden Schrägstrich', () => {
    expect(istAktuell('/kurse/', '/kurse')).toBe(true);
  });

  it('zählt Unterseiten mit', () => {
    expect(istAktuell('/kurse/online', '/kurse')).toBe(true);
  });

  it('verwechselt ähnliche Pfade nicht', () => {
    expect(istAktuell('/kurse-extra', '/kurse')).toBe(false);
    expect(istAktuell('/', '/kurse')).toBe(false);
  });
});

describe('hauptnavigation', () => {
  it('hat höchstens fünf Punkte', () => {
    expect(hauptnavigation.length).toBeLessThanOrEqual(5);
  });

  it('hat nur eindeutige Adressen', () => {
    const adressen = hauptnavigation.map((l) => l.href);
    expect(new Set(adressen).size).toBe(adressen.length);
  });
});

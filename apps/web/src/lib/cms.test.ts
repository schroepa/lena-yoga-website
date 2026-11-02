import { afterEach, describe, expect, it, vi } from 'vitest';

import kurseFixture from '../data/fixtures/kurse.json';
import { kursSchema, ladeKurse, sortiereKurse } from './cms';

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env['CMS_URL'];
});

describe('Beispieldaten', () => {
  it('entsprechen dem Schema des CMS', () => {
    for (const kurs of kurseFixture.docs) expect(() => kursSchema.parse(kurs)).not.toThrow();
  });
});

describe('sortiereKurse', () => {
  it('sortiert nach Wochentag und Uhrzeit', async () => {
    const kurse = await ladeKurse();
    const tage = kurse.map((k) => k.wochentag);
    expect(tage).toEqual(
      [...tage].sort(
        (a, b) =>
          ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'].indexOf(a) -
          ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'].indexOf(b),
      ),
    );
  });

  it('verändert die Eingabe nicht', () => {
    const eingabe = [...kurseFixture.docs].reverse().map((k) => kursSchema.parse(k));
    const kopie = [...eingabe];
    sortiereKurse(eingabe);
    expect(eingabe).toEqual(kopie);
  });
});

describe('ladeKurse mit CMS', () => {
  it('lädt und prüft die Antwort', async () => {
    process.env['CMS_URL'] = 'https://cms.test.example/';
    const abruf = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(kurseFixture) });
    vi.stubGlobal('fetch', abruf);
    const kurse = await ladeKurse();
    expect(kurse).toHaveLength(kurseFixture.docs.length);
    expect(abruf).toHaveBeenCalledWith(
      'https://cms.test.example/api/kurse?limit=100&depth=0',
      expect.anything(),
    );
  });

  it('bricht bei ungültigen Daten ab, statt Fehler zu veröffentlichen', async () => {
    process.env['CMS_URL'] = 'https://cms.test.example';
    const kaputt = { docs: [{ ...kurseFixture.docs[0], buchungslink: 'http://unsicher.example' }] };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(kaputt) }),
    );
    await expect(ladeKurse()).rejects.toThrow();
  });

  it('bricht ab, wenn das CMS nicht erreichbar ist', async () => {
    process.env['CMS_URL'] = 'https://cms.test.example';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Netzwerk weg')));
    await expect(ladeKurse()).rejects.toThrow(/CMS nicht erreichbar/);
  }, 15_000);
});

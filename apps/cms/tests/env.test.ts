import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { leseUmgebung } from '../src/lib/env';

const medienNamen = [
  'R2_BUCKET',
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_PUBLIC_URL',
] as const;

describe('Medien-Speicher aus der Umgebung', () => {
  const vorher = { ...process.env };

  beforeEach(() => {
    process.env['PAYLOAD_SECRET'] = 'x'.repeat(40);
    process.env['DATABASE_URL'] = 'postgres://test@localhost/test';
    for (const n of medienNamen) Reflect.deleteProperty(process.env, n);
  });

  afterEach(() => {
    process.env = { ...vorher };
  });

  it('ist ohne Angaben aus (lokale Speicherung, nur Entwicklung)', () => {
    expect(leseUmgebung().medien).toBeUndefined();
  });

  it('lehnt unvollständige Angaben ab und nennt, was fehlt', () => {
    process.env['R2_BUCKET'] = 'medien';
    expect(() => leseUmgebung()).toThrow(/R2_ENDPOINT.*R2_PUBLIC_URL/);
  });

  it('verlangt eine https-Adresse für die Auslieferung', () => {
    for (const n of medienNamen) process.env[n] = 'wert';
    process.env['R2_PUBLIC_URL'] = 'http://medien.example.com';
    expect(() => leseUmgebung()).toThrow(/https/);
  });

  it('entfernt den Schrägstrich am Ende der öffentlichen Adresse', () => {
    for (const n of medienNamen) process.env[n] = 'wert';
    process.env['R2_PUBLIC_URL'] = 'https://medien.example.com/';
    expect(leseUmgebung().medien?.oeffentlicheAdresse).toBe('https://medien.example.com');
  });
});

import sharp from 'sharp';
import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import config from '../src/payload.config';
import { berechneLesezeit } from '../src/collections/Posts';
import { legeErstenAdminAn, pruefePasswort } from '../src/lib/erster-admin';

let payload: Payload;
let adminId: number | string;
let redaktionId: number | string;

const kurs = {
  titel: 'Sanft ankommen',
  ort: 'online' as const,
  wochentag: 'mo' as const,
  uhrzeit: '18:30',
  dauerMinuten: 60,
  beschreibung: 'Ein ruhiger Einstieg mit viel Zeit für Pausen.',
  buchungslink: 'https://example.com/buchen',
};

async function bildDatei() {
  const daten = await sharp({
    create: { width: 40, height: 40, channels: 3, background: '#79a18f' },
  })
    .png()
    .toBuffer();
  return { data: daten, mimetype: 'image/png', name: 'test.png', size: daten.length };
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterAll(async () => {
  await payload.destroy();
});

beforeEach(async () => {
  vi.unstubAllGlobals();
  delete process.env['DEPLOY_HOOK_URL'];
  for (const collection of [
    'kurse',
    'meditationen',
    'gedanken',
    'anleitungen',
    'fragen',
    'media',
    'audio',
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true });
  }
  await payload.delete({
    collection: 'users',
    where: { id: { exists: true } },
    overrideAccess: true,
  });
  const admin = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@test.example',
      password: 'Test-Passwort-12345!',
      name: 'Admin',
      role: 'admin',
    },
  });
  const redaktion = await payload.create({
    collection: 'users',
    data: {
      email: 'lena@test.example',
      password: 'Test-Passwort-12345!',
      name: 'Lena',
      role: 'editor',
    },
  });
  adminId = admin.id;
  redaktionId = redaktion.id;
});

async function alsNutzer(id: number | string) {
  return payload.findByID({ collection: 'users', id });
}

describe('Öffentlicher Lesezugriff', () => {
  it('zeigt Besuchern nur veröffentlichte Kurse', async () => {
    const redaktion = await alsNutzer(redaktionId);
    await payload.create({
      collection: 'kurse',
      data: { ...kurs, _status: 'published' },
      user: redaktion,
      overrideAccess: false,
    });
    await payload.create({
      collection: 'kurse',
      data: { ...kurs, titel: 'Entwurf', _status: 'draft' },
      user: redaktion,
      overrideAccess: false,
      draft: true,
    });

    const oeffentlich = await payload.find({ collection: 'kurse', overrideAccess: false });
    expect(oeffentlich.docs.map((k) => k.titel)).toEqual(['Sanft ankommen']);

    const intern = await payload.find({
      collection: 'kurse',
      user: redaktion,
      overrideAccess: false,
      draft: true,
    });
    expect(intern.docs.length).toBe(2);
  });

  it('lässt Besucher Navigation und Seiteneinstellungen lesen', async () => {
    await expect(
      payload.findGlobal({ slug: 'navigation', overrideAccess: false }),
    ).resolves.toBeTruthy();
    await expect(
      payload.findGlobal({ slug: 'seiteneinstellungen', overrideAccess: false }),
    ).resolves.toBeTruthy();
  });
});

describe('Schreibzugriff', () => {
  it('verbietet Besuchern jede Änderung', async () => {
    await expect(
      payload.create({ collection: 'kurse', data: kurs, overrideAccess: false }),
    ).rejects.toThrow();
    await expect(
      payload.updateGlobal({
        slug: 'navigation',
        data: { haupt: [{ label: 'X', href: '/x' }], hauptaktion: { label: 'Y', href: '/y' } },
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });

  it('erlaubt der Redaktion, Inhalte anzulegen und zu ändern', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const angelegt = await payload.create({
      collection: 'kurse',
      data: kurs,
      user: redaktion,
      overrideAccess: false,
    });
    const geaendert = await payload.update({
      collection: 'kurse',
      id: angelegt.id,
      data: { titel: 'Sanft ankommen (neu)' },
      user: redaktion,
      overrideAccess: false,
    });
    expect(geaendert.titel).toBe('Sanft ankommen (neu)');
  });

  it('erlaubt der Redaktion nicht, Inhalte zu löschen', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const admin = await alsNutzer(adminId);
    const angelegt = await payload.create({
      collection: 'kurse',
      data: kurs,
      user: redaktion,
      overrideAccess: false,
    });
    await expect(
      payload.delete({
        collection: 'kurse',
        id: angelegt.id,
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
    await expect(
      payload.delete({ collection: 'kurse', id: angelegt.id, user: admin, overrideAccess: false }),
    ).resolves.toBeTruthy();
  });
});

describe('Benutzer und Rollen', () => {
  it('erlaubt nur Admins, Benutzer anzulegen', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const admin = await alsNutzer(adminId);
    const neu = {
      email: 'neu@test.example',
      password: 'Test-Passwort-12345!',
      name: 'Neu',
      role: 'editor' as const,
    };
    await expect(
      payload.create({ collection: 'users', data: neu, user: redaktion, overrideAccess: false }),
    ).rejects.toThrow();
    await expect(
      payload.create({ collection: 'users', data: neu, user: admin, overrideAccess: false }),
    ).resolves.toBeTruthy();
  });

  it('verhindert, dass sich die Redaktion selbst zum Admin macht', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const nachher = await payload.update({
      collection: 'users',
      id: redaktionId,
      data: { role: 'admin' },
      user: redaktion,
      overrideAccess: false,
    });
    expect(nachher.role).toBe('editor');
  });

  it('zeigt der Redaktion nur das eigene Konto', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const sichtbar = await payload.find({
      collection: 'users',
      user: redaktion,
      overrideAccess: false,
    });
    expect(sichtbar.docs.map((u) => u.id)).toEqual([redaktionId]);
  });

  it('sperrt das Konto nach fünf falschen Anmeldungen', async () => {
    for (let i = 0; i < 5; i += 1) {
      await expect(
        payload.login({
          collection: 'users',
          data: { email: 'lena@test.example', password: 'falsch' },
        }),
      ).rejects.toThrow();
    }
    await expect(
      payload.login({
        collection: 'users',
        data: { email: 'lena@test.example', password: 'Test-Passwort-12345!' },
      }),
    ).rejects.toThrow(/gesperrt|locked/i);
  });
});

describe('Bilder', () => {
  it('lehnt Bilder ohne Alt-Text ab', async () => {
    const redaktion = await alsNutzer(redaktionId);
    await expect(
      payload.create({
        collection: 'media',
        data: { alt: '', einwilligung: true },
        file: await bildDatei(),
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });

  it('lehnt Bilder ohne bestätigte Einwilligung ab', async () => {
    const redaktion = await alsNutzer(redaktionId);
    await expect(
      payload.create({
        collection: 'media',
        data: { alt: 'Lena im Drehsitz im Sonnenlicht', einwilligung: false },
        file: await bildDatei(),
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });

  it('nimmt ein Bild mit Alt-Text und Einwilligung an', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const bild = await payload.create({
      collection: 'media',
      data: { alt: 'Lena im Drehsitz im Sonnenlicht', einwilligung: true },
      file: await bildDatei(),
      user: redaktion,
      overrideAccess: false,
    });
    expect(bild.alt).toContain('Drehsitz');
  });

  it('lehnt andere Dateitypen ab', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const daten = Buffer.from('<script>alert(1)</script>');
    await expect(
      payload.create({
        collection: 'media',
        data: { alt: 'Kein Bild, sondern ein Skript', einwilligung: true },
        file: { data: daten, mimetype: 'text/html', name: 'x.html', size: daten.length },
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });
});

describe('Eingaben prüfen', () => {
  it('lehnt falsche Uhrzeiten und unsichere Links ab', async () => {
    const redaktion = await alsNutzer(redaktionId);
    await expect(
      payload.create({
        collection: 'kurse',
        data: { ...kurs, uhrzeit: '25:99' },
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
    await expect(
      payload.create({
        collection: 'kurse',
        data: { ...kurs, buchungslink: 'javascript:alert(1)' },
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
    await expect(
      payload.create({
        collection: 'kurse',
        data: { ...kurs, buchungslink: 'http://example.com' },
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });

  it('lehnt unsichere Navigationslinks ab', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const aktion = { label: 'Probestunde buchen', href: '/kurse' };
    await expect(
      payload.updateGlobal({
        slug: 'navigation',
        data: { haupt: [{ label: 'Böse', href: 'javascript:alert(1)' }], hauptaktion: aktion },
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow(/https|Link/);
    await expect(
      payload.updateGlobal({
        slug: 'navigation',
        data: { haupt: [{ label: 'Kurse', href: '/kurse' }], hauptaktion: aktion },
        user: redaktion,
        overrideAccess: false,
      }),
    ).resolves.toBeTruthy();
  });
});

describe('Neubau der öffentlichen Seite', () => {
  it('wird beim Veröffentlichen ausgelöst, bei Entwürfen nicht', async () => {
    process.env['DEPLOY_HOOK_URL'] = 'https://deploy.test.example/hook';
    const abruf = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', abruf);
    const redaktion = await alsNutzer(redaktionId);

    await payload.create({
      collection: 'kurse',
      data: { ...kurs, _status: 'draft' },
      user: redaktion,
      overrideAccess: false,
      draft: true,
    });
    expect(abruf).not.toHaveBeenCalled();

    await payload.create({
      collection: 'kurse',
      data: { ...kurs, _status: 'published' },
      user: redaktion,
      overrideAccess: false,
    });
    expect(abruf).toHaveBeenCalledTimes(1);
    expect(abruf).toHaveBeenCalledWith(
      'https://deploy.test.example/hook',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('lässt das Speichern gelingen, auch wenn der Neubau-Aufruf scheitert', async () => {
    process.env['DEPLOY_HOOK_URL'] = 'https://deploy.test.example/hook';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Netzwerk weg')));
    const redaktion = await alsNutzer(redaktionId);
    const angelegt = await payload.create({
      collection: 'kurse',
      data: { ...kurs, _status: 'published' },
      user: redaktion,
      overrideAccess: false,
    });
    expect(angelegt.titel).toBe(kurs.titel);
  });
});

describe('Gedanken', () => {
  it('speichert einen Text mit Rich-Text und berechnet die Lesezeit', async () => {
    const redaktion = await alsNutzer(redaktionId);
    const text = {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'text',
                text: 'Langsam unterrichten heißt, Raum zu lassen.',
                version: 1,
                format: 0,
                mode: 'normal',
                style: '',
                detail: 0,
              },
            ],
          },
        ],
      },
    };
    const gedanke = await payload.create({
      collection: 'gedanken',
      data: {
        titel: 'Warum ich langsam unterrichte',
        slug: 'langsam-unterrichten',
        kategorie: 'atmen',
        text: text as never,
        veroeffentlichtAm: new Date().toISOString(),
        _status: 'published',
      },
      user: redaktion,
      overrideAccess: false,
    });
    expect(gedanke.lesezeitMinuten).toBe(1);
    const oeffentlich = await payload.find({ collection: 'gedanken', overrideAccess: false });
    expect(oeffentlich.docs).toHaveLength(1);
  });

  it('lehnt ungültige Adressen (Slugs) ab', async () => {
    const redaktion = await alsNutzer(redaktionId);
    await expect(
      payload.create({
        collection: 'gedanken',
        data: {
          titel: 'X',
          slug: 'Ungültig Mit Leerzeichen!',
          kategorie: 'atmen',
          text: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr' as const,
              children: [],
            },
          },
          veroeffentlichtAm: new Date().toISOString(),
        },
        user: redaktion,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });
});

describe('Lesezeit', () => {
  const absatz = (anzahl: number) => ({
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', text: Array.from({ length: anzahl }, () => 'wort').join(' ') },
          ],
        },
      ],
    },
  });

  it('rechnet 200 Wörter pro Minute, mindestens eine Minute', () => {
    expect(berechneLesezeit(absatz(30))).toBe(1);
    expect(berechneLesezeit(absatz(1000))).toBe(5);
    expect(berechneLesezeit(null)).toBe(1);
  });
});

describe('Erster Admin', () => {
  it('lehnt schwache Passwörter ab', () => {
    expect(pruefePasswort(undefined)).toMatch(/fehlt/);
    expect(pruefePasswort('kurz')).toMatch(/zu kurz/);
    expect(pruefePasswort('aaaaaaaaaaaaaaaaaaaa')).toMatch(/gleichförmig/);
    expect(pruefePasswort('Eine-lange-Passphrase-2026')).toBeUndefined();
  });

  it('legt den ersten Admin an, aber nur, wenn es noch keinen Benutzer gibt', async () => {
    await payload.delete({
      collection: 'users',
      where: { id: { exists: true } },
      overrideAccess: true,
    });
    await expect(
      legeErstenAdminAn(payload, { email: 'erster@test.example', passwort: 'zu kurz' }),
    ).rejects.toThrow(/kurz/);
    await expect(
      legeErstenAdminAn(payload, {
        email: 'erster@test.example',
        passwort: 'Eine-lange-Passphrase-2026',
      }),
    ).resolves.toBe('angelegt');
    await expect(
      legeErstenAdminAn(payload, {
        email: 'zweiter@test.example',
        passwort: 'Eine-lange-Passphrase-2026',
      }),
    ).resolves.toBe('uebersprungen');
    const alle = await payload.find({ collection: 'users', overrideAccess: true });
    expect(alle.docs).toHaveLength(1);
    expect(alle.docs[0]?.role).toBe('admin');
  });
});

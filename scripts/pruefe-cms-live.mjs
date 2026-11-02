#!/usr/bin/env node
/**
 * Prüft ein veröffentlichtes CMS auf die wichtigsten Sicherheitsregeln.
 * Nutzung: node scripts/pruefe-cms-live.mjs https://cms.example.com
 * Es werden nur harmlose Anfragen gestellt (keine Anmeldung, keine Änderung von Daten).
 */
const basis = process.argv[2]?.replace(/\/$/, '');
if (!basis) {
  console.error(
    'Bitte die Adresse des CMS angeben, zum Beispiel: node scripts/pruefe-cms-live.mjs https://cms.example.com',
  );
  process.exit(2);
}

let fehler = 0;
const pruefe = (name, ok, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` ${detail}` : ''}`);
  if (!ok) fehler += 1;
};

const admin = await fetch(`${basis}/admin`, { redirect: 'follow' });
pruefe('Anmeldeseite erreichbar', admin.status === 200, `(${String(admin.status)})`);
pruefe('HTTPS', new URL(admin.url).protocol === 'https:');
pruefe(
  'Strict-Transport-Security',
  /max-age=\d{7,}/.test(admin.headers.get('strict-transport-security') ?? ''),
);
pruefe(
  'Frame-Schutz (CSP frame-ancestors)',
  /frame-ancestors 'none'/.test(admin.headers.get('content-security-policy') ?? ''),
);
pruefe('X-Content-Type-Options', admin.headers.get('x-content-type-options') === 'nosniff');
pruefe(
  'Nicht für Suchmaschinen (X-Robots-Tag)',
  /noindex/.test(admin.headers.get('x-robots-tag') ?? ''),
);
pruefe('Kein X-Powered-By', admin.headers.get('x-powered-by') === null);

const graphql = await fetch(`${basis}/api/graphql`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query: '{ __typename }' }),
});
pruefe(
  'Keine GraphQL-Schnittstelle',
  graphql.status === 404 || graphql.status === 405,
  `(${String(graphql.status)})`,
);

const lesen = await fetch(`${basis}/api/kurse?limit=1&depth=0`);
pruefe('Öffentliche Kurse lesbar', lesen.ok, `(${String(lesen.status)})`);
if (lesen.ok) {
  const daten = await lesen.json();
  const entwuerfe = (daten.docs ?? []).filter((d) => d._status && d._status !== 'published');
  pruefe('Öffentlich nur Veröffentlichtes', entwuerfe.length === 0);
}

const anlegen = await fetch(`${basis}/api/kurse`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ titel: 'Sicherheitsprüfung' }),
});
pruefe(
  'Anonym anlegen ist verboten',
  anlegen.status === 401 || anlegen.status === 403,
  `(${String(anlegen.status)})`,
);

const benutzer = await fetch(`${basis}/api/users`);
pruefe(
  'Benutzerliste nicht öffentlich',
  benutzer.status === 401 || benutzer.status === 403,
  `(${String(benutzer.status)})`,
);

const erster = await fetch(`${basis}/api/users/first-register`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: '{}',
});
pruefe(
  'Erste Registrierung ist geschlossen (es gibt schon einen Admin)',
  erster.status === 403,
  `(${String(erster.status)})`,
);

if (fehler > 0) {
  console.error(`\n${String(fehler)} Prüfung(en) fehlgeschlagen.`);
  process.exit(1);
}
console.log('\nAlle Prüfungen bestanden.');

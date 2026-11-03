#!/usr/bin/env node
/**
 * Prüft eine veröffentlichte Seite auf die erwarteten Sicherheits-Header und Caching-Regeln.
 * Nutzung: node scripts/pruefe-live.mjs https://deine-seite.pages.dev
 */
const basis = process.argv[2];
if (!basis) {
  console.error(
    'Bitte die Adresse angeben, zum Beispiel: node scripts/pruefe-live.mjs https://example.com',
  );
  process.exit(2);
}

const erwartet = {
  'strict-transport-security': /max-age=\d{7,}.*includeSubDomains/i,
  'content-security-policy': /frame-ancestors 'none'/,
  'x-content-type-options': /^nosniff$/i,
  'x-frame-options': /^deny$/i,
  'referrer-policy': /strict-origin-when-cross-origin/,
  'permissions-policy': /camera=\(\)/,
  'cross-origin-opener-policy': /^same-origin$/,
  'cross-origin-resource-policy': /^same-origin$/,
};

let fehler = 0;
const pruefe = (name, ok, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` ${detail}` : ''}`);
  if (!ok) fehler += 1;
};

const antwort = await fetch(basis, { redirect: 'follow' });
pruefe('Antwort 200', antwort.status === 200, `(${String(antwort.status)})`);
pruefe('HTTPS', new URL(antwort.url).protocol === 'https:');

for (const [name, muster] of Object.entries(erwartet)) {
  const wert = antwort.headers.get(name);
  pruefe(
    `Header ${name}`,
    wert !== null && muster.test(wert),
    wert ? `→ ${wert.slice(0, 70)}` : '→ fehlt',
  );
}

const html = await antwort.text();
pruefe(
  'CSP-Meta mit Hashes im HTML',
  /http-equiv="content-security-policy"[^>]*sha256-/.test(html),
);
pruefe('Sprache gesetzt (lang="de")', /<html[^>]*lang="de"/.test(html));
pruefe('Keine fremden Skripte', !/<script[^>]*src="https?:\/\//.test(html));

const asset = /\/_astro\/[^"')\s]+\.woff2/.exec(html)?.[0];
if (asset) {
  const a = await fetch(new URL(asset, antwort.url));
  pruefe(
    'Schrift lang gecacht (immutable)',
    /immutable/.test(a.headers.get('cache-control') ?? ''),
  );
}

const robots = await fetch(new URL('/robots.txt', antwort.url));
pruefe('robots.txt erreichbar', robots.ok);
const sitemap = await fetch(new URL('/sitemap-index.xml', antwort.url));
pruefe('Sitemap erreichbar', sitemap.ok);

if (fehler > 0) {
  console.error(`\n${String(fehler)} Prüfung(en) fehlgeschlagen.`);
  process.exit(1);
}
console.log('\nAlle Prüfungen bestanden.');

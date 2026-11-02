#!/usr/bin/env node
/**
 * Lighthouse-Prüfung für alle Seiten aus der Sitemap.
 *
 * - Startet die gebaute Seite lokal (astro preview).
 * - Misst jede Seite mobil und Desktop mehrfach und nimmt den Median je Kategorie.
 * - Schlägt fehl, wenn eine Kategorie unter dem Mindestwert liegt (Standard: 100).
 *
 * Lighthouse wird mit fester Version über npx geholt (ohne Installationsskripte),
 * damit pnpms Lieferketten-Regeln nicht aufgeweicht werden müssen.
 *
 * Umgebungsvariablen: LH_RUNS (Standard 3), LH_MIN (Standard 100), CHROME_PATH,
 * LH_URL (optional: gegen eine veröffentlichte Adresse messen statt gegen die lokale Vorschau).
 */
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const LIGHTHOUSE_VERSION = '13.6.0';
const PORT = 4321;
const LIVE_URL = process.env.LH_URL?.replace(/\/$/, '');
const BASIS = LIVE_URL ?? `http://localhost:${String(PORT)}`;
const RUNS = Number(process.env.LH_RUNS ?? 3);
const MIN = Number(process.env.LH_MIN ?? 100);
const ROOT = resolve(import.meta.dirname, '..');
const WEB = resolve(ROOT, 'apps/web');

const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');

function seitenAusSitemap() {
  const xml = readFileSync(resolve(WEB, 'dist/sitemap-0.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

function median(werte) {
  const sortiert = [...werte].sort((a, b) => a - b);
  const mitte = Math.floor(sortiert.length / 2);
  return sortiert.length % 2 ? sortiert[mitte] : (sortiert[mitte - 1] + sortiert[mitte]) / 2;
}

async function warteAuf(url, versuche = 50) {
  for (let i = 0; i < versuche; i += 1) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* Server startet noch */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server unter ${url} antwortet nicht.`);
}

function messe(url, preset) {
  const args = [
    '-y',
    `lighthouse@${LIGHTHOUSE_VERSION}`,
    url,
    '--output=json',
    '--output-path=stdout',
    '--quiet',
    `--chrome-path=${CHROME}`,
    '--chrome-flags=--headless=new --no-sandbox',
  ];
  if (preset === 'desktop') args.push('--preset=desktop');
  const ausgabe = execFileSync('npx', args, {
    env: { ...process.env, npm_config_ignore_scripts: 'true' },
    maxBuffer: 64 * 1024 * 1024,
    encoding: 'utf8',
  });
  const bericht = JSON.parse(ausgabe);
  return Object.fromEntries(
    Object.entries(bericht.categories).map(([id, kategorie]) => [
      id,
      Math.round((kategorie.score ?? 0) * 100),
    ]),
  );
}

const server = LIVE_URL
  ? undefined
  : spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORT), '--ignore-lock'], {
      cwd: WEB,
      stdio: 'ignore',
    });

let fehlgeschlagen = false;
try {
  await warteAuf(`${BASIS}/`);
  const seiten = seitenAusSitemap();
  console.log(
    `Lighthouse ${LIGHTHOUSE_VERSION}: ${seiten.length} Seite(n), ${RUNS} Läufe, Mindestwert ${MIN}`,
  );
  for (const pfad of seiten) {
    for (const preset of ['mobile', 'desktop']) {
      const laeufe = Array.from({ length: RUNS }, () => messe(`${BASIS}${pfad}`, preset));
      const kategorien = Object.keys(laeufe[0] ?? {});
      const ergebnis = Object.fromEntries(
        kategorien.map((k) => [k, median(laeufe.map((l) => l[k] ?? 0))]),
      );
      const schlecht = Object.entries(ergebnis).filter(([, wert]) => wert < MIN);
      console.log(`${schlecht.length ? '✗' : '✓'} ${pfad} (${preset})`, JSON.stringify(ergebnis));
      if (schlecht.length) fehlgeschlagen = true;
    }
  }
} finally {
  server?.kill();
}

if (fehlgeschlagen) {
  console.error('Mindestens eine Kategorie liegt unter dem Mindestwert.');
  process.exit(1);
}

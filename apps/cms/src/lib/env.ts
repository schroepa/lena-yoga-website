/**
 * Umgebungsvariablen, einmal geprüft. Fehlt etwas Wichtiges oder ist es zu schwach,
 * startet das CMS gar nicht erst (besser als unsicher zu laufen).
 */
function optional(name: string): string | undefined {
  const wert = process.env[name];
  if (wert === undefined || wert === '') return undefined;
  return wert;
}

/** Medien-Speicher (Cloudflare R2). Entweder alles gesetzt oder gar nichts (dann lokal, nur Entwicklung). */
function leseMedien() {
  const namen = [
    'R2_BUCKET',
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_PUBLIC_URL',
  ] as const;
  const gesetzt = namen.filter((n) => optional(n) !== undefined);
  if (gesetzt.length === 0) return undefined;
  const fehlend = namen.filter((n) => optional(n) === undefined);
  if (fehlend.length > 0)
    throw new Error(`Medien-Speicher unvollständig. Es fehlt: ${fehlend.join(', ')}.`);
  const oeffentlich = new URL(pflicht('R2_PUBLIC_URL'));
  if (oeffentlich.protocol !== 'https:')
    throw new Error('R2_PUBLIC_URL muss mit https:// beginnen.');
  return {
    bucket: pflicht('R2_BUCKET'),
    endpunkt: pflicht('R2_ENDPOINT'),
    zugangsschluessel: pflicht('R2_ACCESS_KEY_ID'),
    geheimerSchluessel: pflicht('R2_SECRET_ACCESS_KEY'),
    /** Ohne Schrägstrich am Ende. */
    oeffentlicheAdresse: oeffentlich.origin + oeffentlich.pathname.replace(/\/$/, ''),
  };
}

function pflicht(name: string): string {
  const wert = process.env[name];
  if (!wert) throw new Error(`Umgebungsvariable ${name} fehlt.`);
  return wert;
}

export function leseUmgebung() {
  const secret = pflicht('PAYLOAD_SECRET');
  if (secret.length < 32) {
    throw new Error(
      'PAYLOAD_SECRET ist zu kurz. Mindestens 32 Zeichen (zum Beispiel: openssl rand -hex 32).',
    );
  }
  return {
    secret,
    datenbank: pflicht('DATABASE_URL'),
    /** Adressen, die Anfragen an die API stellen dürfen (öffentliche Seite und CMS selbst). */
    erlaubteHerkuenfte: [process.env['WEB_ORIGIN'], process.env['CMS_ORIGIN']].filter(
      (o): o is string => Boolean(o),
    ),
    medien: leseMedien(),
    deployHook: process.env['DEPLOY_HOOK_URL'],
    istProduktion: process.env['NODE_ENV'] === 'production',
  };
}

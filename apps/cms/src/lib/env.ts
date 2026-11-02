/**
 * Umgebungsvariablen, einmal geprüft. Fehlt etwas Wichtiges oder ist es zu schwach,
 * startet das CMS gar nicht erst (besser als unsicher zu laufen).
 */
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
    blobToken: process.env['BLOB_READ_WRITE_TOKEN'],
    deployHook: process.env['VERCEL_DEPLOY_HOOK_URL'],
    istProduktion: process.env['NODE_ENV'] === 'production',
  };
}

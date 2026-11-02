/**
 * Legt den ersten Admin an. Aufruf (Passwort nie als Argument, nur als Umgebungsvariable):
 *   ADMIN_EMAIL=lena@example.com ADMIN_PASSWORD='…' pnpm --filter @lena/cms admin:anlegen
 */
import { getPayload } from 'payload';

import config from '../payload.config';
import { legeErstenAdminAn } from '../lib/erster-admin';

const payload = await getPayload({ config });
try {
  const ergebnis = await legeErstenAdminAn(payload, {
    email: process.env['ADMIN_EMAIL'],
    passwort: process.env['ADMIN_PASSWORD'],
    name: process.env['ADMIN_NAME'],
  });
  payload.logger.info(
    ergebnis === 'angelegt'
      ? 'Erster Admin angelegt.'
      : 'Es gibt schon einen Benutzer. Nichts geändert.',
  );
} finally {
  await payload.destroy();
}
process.exit(0);

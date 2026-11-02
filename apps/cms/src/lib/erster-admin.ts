import type { Payload } from 'payload';

export interface AdminEingabe {
  email: string | undefined;
  passwort: string | undefined;
  name?: string | undefined;
}

/** Mindestanforderung: lange Passphrase. Länge zählt mehr als Sonderzeichen. */
export function pruefePasswort(passwort: string | undefined): string | undefined {
  if (!passwort) return 'ADMIN_PASSWORD fehlt.';
  if (passwort.length < 16)
    return 'Das Passwort ist zu kurz. Mindestens 16 Zeichen, besser eine lange Passphrase.';
  if (new Set(passwort).size < 8) return 'Das Passwort ist zu gleichförmig.';
  return undefined;
}

/**
 * Legt den ersten Admin an, bevor das CMS öffentlich erreichbar ist.
 * Hintergrund: Solange es keinen Benutzer gibt, kann jeder über /admin den ersten Admin anlegen.
 * Gibt es schon einen Benutzer, passiert nichts.
 */
export async function legeErstenAdminAn(
  payload: Payload,
  eingabe: AdminEingabe,
): Promise<'angelegt' | 'uebersprungen'> {
  const vorhanden = await payload.count({ collection: 'users', overrideAccess: true });
  if (vorhanden.totalDocs > 0) return 'uebersprungen';

  if (!eingabe.email?.includes('@')) throw new Error('ADMIN_EMAIL fehlt oder ist ungültig.');
  const problem = pruefePasswort(eingabe.passwort);
  if (problem || !eingabe.passwort) throw new Error(problem ?? 'Passwort fehlt.');

  await payload.create({
    collection: 'users',
    data: {
      email: eingabe.email,
      password: eingabe.passwort,
      name: eingabe.name ?? 'Admin',
      role: 'admin',
    },
    overrideAccess: true,
  });
  return 'angelegt';
}

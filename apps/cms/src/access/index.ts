import type { Access, FieldAccess, PayloadRequest } from 'payload';

/**
 * Zugriffsregeln. Grundsatz: Was nicht ausdrücklich erlaubt ist, ist verboten.
 */
type Rolle = 'admin' | 'editor';

function rolleVon(req: PayloadRequest): Rolle | undefined {
  const rolle = (req.user as { role?: Rolle } | null)?.role;
  return rolle === 'admin' || rolle === 'editor' ? rolle : undefined;
}

export const istAdmin: Access = ({ req }) => rolleVon(req) === 'admin';

export const istRedaktion: Access = ({ req }) => rolleVon(req) !== undefined;

export const istAdminFeld: FieldAccess = ({ req }) => rolleVon(req) === 'admin';

/** Öffentlich lesbar, aber nur Veröffentlichtes. Angemeldete sehen auch Entwürfe. */
export const nurVeroeffentlichtesOeffentlich: Access = ({ req }) => {
  if (rolleVon(req)) return true;
  return { _status: { equals: 'published' } };
};

/** Immer öffentlich lesbar (zum Beispiel Bilder, Navigation). */
export const oeffentlichLesbar: Access = () => true;

/** Benutzer: Admin sieht alle, Redaktion nur sich selbst. */
export const eigenesOderAdmin: Access = ({ req }) => {
  const rolle = rolleVon(req);
  if (rolle === 'admin') return true;
  if (rolle === 'editor' && req.user) return { id: { equals: req.user.id } };
  return false;
};

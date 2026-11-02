import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload';

/**
 * Löst nach dem Veröffentlichen einen neuen Build der öffentlichen Seite aus
 * (Vercel Deploy Hook). Entwürfe lösen nichts aus.
 * Schlägt der Aufruf fehl, bleibt die Änderung im CMS gespeichert und es gibt eine Warnung im Log.
 */
async function ausloesen(
  logger: { warn: (nachricht: string) => void },
  grund: string,
): Promise<void> {
  const url = process.env['VERCEL_DEPLOY_HOOK_URL'];
  if (!url) return;
  try {
    const antwort = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(5000) });
    if (!antwort.ok)
      logger.warn(`Neubau nicht ausgelöst (${grund}): HTTP ${String(antwort.status)}`);
  } catch (fehler) {
    logger.warn(
      `Neubau nicht ausgelöst (${grund}): ${fehler instanceof Error ? fehler.message : 'unbekannt'}`,
    );
  }
}

function istEntwurf(doc: unknown): boolean {
  const status = (doc as { _status?: string } | null)?._status;
  return status !== undefined && status !== 'published';
}

export const nachAenderungNeuBauen: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
}) => {
  if (!istEntwurf(doc)) await ausloesen(req.payload.logger, collection.slug);
  return doc;
};

export const nachLoeschenNeuBauen: CollectionAfterDeleteHook = async ({ doc, req, collection }) => {
  await ausloesen(req.payload.logger, `${collection.slug} gelöscht`);
  return doc;
};

export const globalNachAenderungNeuBauen: GlobalAfterChangeHook = async ({ doc, req, global }) => {
  if (!istEntwurf(doc)) await ausloesen(req.payload.logger, global.slug);
  return doc;
};

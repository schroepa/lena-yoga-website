import type { Field, GlobalConfig } from 'payload';

import { istRedaktion, oeffentlichLesbar } from '../access';
import { globalNachAenderungNeuBauen } from '../hooks/rebuild';

/** Interne Links (/kurse) oder https-Links. Alles andere (zum Beispiel javascript:) wird abgelehnt. */
function istErlaubterLink(wert: unknown): true | string {
  if (typeof wert !== 'string') return 'Bitte einen Link angeben.';
  if (/^\/[a-z0-9\-/]*$/.test(wert)) return true;
  try {
    return new URL(wert).protocol === 'https:' || 'Externe Links müssen mit https:// beginnen.';
  } catch {
    return 'Interne Links beginnen mit /, zum Beispiel /kurse.';
  }
}

const linkFelder: Field[] = [
  { name: 'label', label: 'Beschriftung', type: 'text', required: true, maxLength: 30 },
  { name: 'href', label: 'Link', type: 'text', required: true, validate: istErlaubterLink },
];

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: { read: oeffentlichLesbar, update: istRedaktion },
  hooks: { afterChange: [globalNachAenderungNeuBauen] },
  fields: [
    {
      name: 'haupt',
      label: 'Hauptnavigation (höchstens fünf Punkte)',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 5,
      fields: linkFelder,
    },
    {
      name: 'service',
      label: 'Service-Links im Fuß',
      type: 'array',
      maxRows: 8,
      fields: linkFelder,
    },
    {
      name: 'hauptaktion',
      label: 'Hauptaktion (Button)',
      type: 'group',
      fields: linkFelder,
    },
  ],
};

import type { CollectionConfig } from 'payload';

import { istAdmin, istRedaktion, oeffentlichLesbar } from '../access';
import { nachAenderungNeuBauen, nachLoeschenNeuBauen } from '../hooks/rebuild';

/** Bilder. Der Alt-Text ist Pflicht, damit Barrierefreiheit nicht vom Zufall abhängt. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Bild', plural: 'Bilder' },
  admin: { useAsTitle: 'alt', defaultColumns: ['alt', 'filename', 'updatedAt'] },
  access: {
    read: oeffentlichLesbar,
    create: istRedaktion,
    update: istRedaktion,
    delete: istAdmin,
  },
  hooks: { afterChange: [nachAenderungNeuBauen], afterDelete: [nachLoeschenNeuBauen] },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    adminThumbnail: 'vorschau',
    // Original wird auf eine sinnvolle Größe begrenzt, Metadaten (zum Beispiel GPS) fallen dabei weg.
    resizeOptions: { width: 2800, withoutEnlargement: true },
    imageSizes: [
      { name: 'vorschau', width: 400, withoutEnlargement: true },
      { name: 'karte', width: 800, withoutEnlargement: true },
      { name: 'gross', width: 1600, withoutEnlargement: true },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt-Text',
      type: 'text',
      required: true,
      minLength: 8,
      maxLength: 200,
      admin: {
        description:
          'Beschreibt, was auf dem Bild zu sehen ist (für Screenreader). Zum Beispiel: „Lena im Drehsitz, Sonnenlicht von links“.',
      },
    },
    { name: 'bildnachweis', label: 'Bildnachweis', type: 'text' },
    {
      name: 'einwilligung',
      label: 'Einwilligung der gezeigten Personen liegt vor',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      validate: (wert: unknown) =>
        wert === true || 'Bitte bestätigen, dass die Einwilligung der gezeigten Personen vorliegt.',
    },
  ],
};

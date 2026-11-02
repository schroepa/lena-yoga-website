import type { CollectionConfig } from 'payload';

import { istAdmin, istRedaktion, oeffentlichLesbar } from '../access';

/** Audio-Dateien für die Meditationen. Nur MP3. */
export const Audio: CollectionConfig = {
  slug: 'audio',
  labels: { singular: 'Audio-Datei', plural: 'Audio-Dateien' },
  admin: { useAsTitle: 'titel', defaultColumns: ['titel', 'filename', 'updatedAt'] },
  access: {
    read: oeffentlichLesbar,
    create: istRedaktion,
    update: istRedaktion,
    delete: istAdmin,
  },
  upload: { mimeTypes: ['audio/mpeg'] },
  fields: [
    { name: 'titel', label: 'Titel', type: 'text', required: true },
    {
      name: 'transkript',
      label: 'Transkript oder Kurzbeschreibung',
      type: 'textarea',
      admin: { description: 'Hilft Menschen, die nicht hören können, und der Suche.' },
    },
  ],
};

import type { CollectionConfig } from 'payload';

import { istAdmin, istRedaktion, nurVeroeffentlichtesOeffentlich } from '../access';
import { nachAenderungNeuBauen, nachLoeschenNeuBauen } from '../hooks/rebuild';

export const Faqs: CollectionConfig = {
  slug: 'fragen',
  labels: { singular: 'Frage', plural: 'Häufige Fragen' },
  admin: { useAsTitle: 'frage', defaultColumns: ['frage', 'seite', 'reihenfolge', '_status'] },
  access: {
    read: nurVeroeffentlichtesOeffentlich,
    create: istRedaktion,
    update: istRedaktion,
    delete: istAdmin,
    readVersions: istRedaktion,
  },
  versions: { drafts: true, maxPerDoc: 10 },
  hooks: { afterChange: [nachAenderungNeuBauen], afterDelete: [nachLoeschenNeuBauen] },
  defaultSort: 'reihenfolge',
  fields: [
    { name: 'frage', label: 'Frage', type: 'text', required: true, maxLength: 140 },
    { name: 'antwort', label: 'Antwort', type: 'textarea', required: true, maxLength: 500 },
    {
      name: 'seite',
      label: 'Auf welcher Seite',
      type: 'select',
      required: true,
      defaultValue: 'kurse',
      options: [
        { label: 'Kurse', value: 'kurse' },
        { label: 'Yoga entdecken', value: 'yoga-entdecken' },
      ],
    },
    {
      name: 'reihenfolge',
      label: 'Reihenfolge',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
  ],
};

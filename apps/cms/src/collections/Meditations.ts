import type { CollectionConfig } from 'payload';

import { istAdmin, istRedaktion, nurVeroeffentlichtesOeffentlich } from '../access';
import { nachAenderungNeuBauen, nachLoeschenNeuBauen } from '../hooks/rebuild';

export const Meditations: CollectionConfig = {
  slug: 'meditationen',
  labels: { singular: 'Meditation', plural: 'Meditationen' },
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'dauerMinuten', 'reihenfolge', '_status'],
  },
  access: {
    read: nurVeroeffentlichtesOeffentlich,
    create: istRedaktion,
    update: istRedaktion,
    delete: istAdmin,
    readVersions: istRedaktion,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: { afterChange: [nachAenderungNeuBauen], afterDelete: [nachLoeschenNeuBauen] },
  defaultSort: 'reihenfolge',
  fields: [
    { name: 'titel', label: 'Titel', type: 'text', required: true, maxLength: 80 },
    {
      name: 'dauerMinuten',
      label: 'Dauer in Minuten',
      type: 'number',
      required: true,
      min: 1,
      max: 90,
    },
    { name: 'audio', label: 'Aufnahme', type: 'upload', relationTo: 'audio', required: true },
    { name: 'beschreibung', label: 'Beschreibung', type: 'textarea', maxLength: 220 },
    {
      name: 'reihenfolge',
      label: 'Reihenfolge',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
  ],
};

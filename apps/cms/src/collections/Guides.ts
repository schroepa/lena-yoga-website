import type { CollectionConfig } from 'payload';

import { istAdmin, istRedaktion, nurVeroeffentlichtesOeffentlich } from '../access';
import { nachAenderungNeuBauen, nachLoeschenNeuBauen } from '../hooks/rebuild';

/** Anleitungen zum Mitmachen ("Yoga entdecken"). */
export const Guides: CollectionConfig = {
  slug: 'anleitungen',
  labels: { singular: 'Anleitung', plural: 'Anleitungen' },
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'haltungsart', 'dauerMinuten', '_status'],
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
  fields: [
    { name: 'titel', label: 'Titel', type: 'text', required: true, maxLength: 80 },
    {
      name: 'slug',
      label: 'Adresse (Slug)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (wert: unknown) =>
        (typeof wert === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(wert)) ||
        'Nur Kleinbuchstaben, Ziffern und Bindestriche.',
    },
    {
      name: 'haltungsart',
      label: 'Haltungsart',
      type: 'select',
      required: true,
      options: [
        { label: 'Stehen', value: 'stehen' },
        { label: 'Sitzen', value: 'sitzen' },
        { label: 'Liegen', value: 'liegen' },
        { label: 'Vierfüßler', value: 'vierfuessler' },
      ],
    },
    {
      name: 'dauerMinuten',
      label: 'Dauer in Minuten',
      type: 'number',
      required: true,
      min: 1,
      max: 60,
    },
    { name: 'foto', label: 'Foto', type: 'upload', relationTo: 'media' },
    { name: 'einleitung', label: 'Einleitung', type: 'textarea', required: true, maxLength: 260 },
    {
      name: 'schritte',
      label: 'Schritte',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 10,
      labels: { singular: 'Schritt', plural: 'Schritte' },
      fields: [{ name: 'text', label: 'Text', type: 'textarea', required: true, maxLength: 240 }],
    },
    {
      name: 'hinweis',
      label: 'Hinweis (Variante oder Tipp)',
      type: 'group',
      fields: [
        { name: 'titel', label: 'Titel', type: 'text', maxLength: 40 },
        { name: 'text', label: 'Text', type: 'textarea', maxLength: 260 },
      ],
    },
  ],
};

import type { CollectionConfig } from 'payload';

import { istAdmin, istRedaktion, nurVeroeffentlichtesOeffentlich } from '../access';
import { nachAenderungNeuBauen, nachLoeschenNeuBauen } from '../hooks/rebuild';

export const Courses: CollectionConfig = {
  slug: 'kurse',
  labels: { singular: 'Kurs', plural: 'Kurse' },
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'ort', 'wochentag', 'uhrzeit', '_status'],
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
      name: 'ort',
      label: 'Ort',
      type: 'select',
      required: true,
      options: [
        { label: 'Online (Sophies Safe Space)', value: 'online' },
        { label: 'Im Studio', value: 'studio' },
      ],
    },
    {
      name: 'wochentag',
      label: 'Wochentag',
      type: 'select',
      required: true,
      options: [
        { label: 'Montag', value: 'mo' },
        { label: 'Dienstag', value: 'di' },
        { label: 'Mittwoch', value: 'mi' },
        { label: 'Donnerstag', value: 'do' },
        { label: 'Freitag', value: 'fr' },
        { label: 'Samstag', value: 'sa' },
        { label: 'Sonntag', value: 'so' },
      ],
    },
    {
      name: 'uhrzeit',
      label: 'Uhrzeit (HH:MM)',
      type: 'text',
      required: true,
      validate: (wert: unknown) =>
        (typeof wert === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(wert)) ||
        'Bitte im Format HH:MM angeben, zum Beispiel 18:30.',
    },
    {
      name: 'dauerMinuten',
      label: 'Dauer in Minuten',
      type: 'number',
      required: true,
      min: 10,
      max: 240,
    },
    {
      name: 'beschreibung',
      label: 'Beschreibung',
      type: 'textarea',
      required: true,
      maxLength: 220,
    },
    {
      name: 'buchungslink',
      label: 'Buchungslink (Sophies Safe Space)',
      type: 'text',
      required: true,
      validate: (wert: unknown) => {
        if (typeof wert !== 'string') return 'Bitte einen Link angeben.';
        try {
          return new URL(wert).protocol === 'https:' || 'Der Link muss mit https:// beginnen.';
        } catch {
          return 'Das ist kein gültiger Link.';
        }
      },
    },
  ],
};

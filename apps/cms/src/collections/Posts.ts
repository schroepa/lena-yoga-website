import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';

import { istAdmin, istRedaktion, nurVeroeffentlichtesOeffentlich } from '../access';
import { nachAenderungNeuBauen, nachLoeschenNeuBauen } from '../hooks/rebuild';

/** Lesezeit aus der Wortzahl des Textes (200 Wörter pro Minute, mindestens eine Minute). */
export function berechneLesezeit(text: unknown): number {
  const woerter: string[] = [];
  const sammle = (knoten: unknown): void => {
    if (!knoten || typeof knoten !== 'object') return;
    const k = knoten as { text?: unknown; children?: unknown };
    if (typeof k.text === 'string') woerter.push(...k.text.split(/\s+/).filter(Boolean));
    if (Array.isArray(k.children)) k.children.forEach(sammle);
  };
  sammle((text as { root?: unknown } | null)?.root);
  return Math.max(1, Math.round(woerter.length / 200));
}

const setzeLesezeit: CollectionBeforeChangeHook = ({ data }) => {
  const daten = data as { text?: unknown; lesezeitMinuten?: number };
  daten.lesezeitMinuten = berechneLesezeit(daten.text);
  return daten;
};

/** "Gedanken": Lenas Texte (nicht "Blog" genannt). */
export const Posts: CollectionConfig = {
  slug: 'gedanken',
  labels: { singular: 'Gedanke', plural: 'Gedanken' },
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'kategorie', 'veroeffentlichtAm', '_status'],
  },
  access: {
    read: nurVeroeffentlichtesOeffentlich,
    create: istRedaktion,
    update: istRedaktion,
    delete: istAdmin,
    readVersions: istRedaktion,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    beforeChange: [setzeLesezeit],
    afterChange: [nachAenderungNeuBauen],
    afterDelete: [nachLoeschenNeuBauen],
  },
  defaultSort: '-veroeffentlichtAm',
  fields: [
    { name: 'titel', label: 'Titel', type: 'text', required: true, maxLength: 120 },
    {
      name: 'slug',
      label: 'Adresse (Slug)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (wert: unknown) =>
        (typeof wert === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(wert)) ||
        'Nur Kleinbuchstaben, Ziffern und Bindestriche, zum Beispiel: langsam-unterrichten.',
    },
    {
      name: 'kategorie',
      label: 'Kategorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Atmen', value: 'atmen' },
        { label: 'Körper', value: 'koerper' },
        { label: 'Yoga für jeden', value: 'yoga-fuer-jeden' },
        { label: 'Alltag', value: 'alltag' },
      ],
    },
    { name: 'titelbild', label: 'Titelbild', type: 'upload', relationTo: 'media' },
    { name: 'text', label: 'Text', type: 'richText', required: true },
    {
      name: 'veroeffentlichtAm',
      label: 'Veröffentlicht am',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'lesezeitMinuten',
      label: 'Lesezeit (Minuten, automatisch)',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
};

import type { GlobalConfig } from 'payload';

import { istRedaktion, oeffentlichLesbar } from '../access';
import { globalNachAenderungNeuBauen } from '../hooks/rebuild';

export const SiteSettings: GlobalConfig = {
  slug: 'seiteneinstellungen',
  label: 'Seiteneinstellungen',
  access: { read: oeffentlichLesbar, update: istRedaktion },
  hooks: { afterChange: [globalNachAenderungNeuBauen] },
  fields: [
    {
      name: 'name',
      label: 'Name der Seite',
      type: 'text',
      required: true,
      defaultValue: 'Lena Yoga',
    },
    {
      name: 'claim',
      label: 'Claim',
      type: 'text',
      required: true,
      defaultValue: 'Yoga for EveryBody',
    },
    { name: 'kontaktEmail', label: 'Kontakt-E-Mail', type: 'email' },
    { name: 'studioAdresse', label: 'Adresse des Studios', type: 'textarea' },
    {
      name: 'abschluss',
      label: 'Abschluss am Ende der Seiten',
      type: 'group',
      fields: [
        {
          name: 'titel',
          label: 'Titel',
          type: 'text',
          required: true,
          defaultValue: 'Probestunde buchen und Lena kennenlernen.',
        },
        {
          name: 'text',
          label: 'Text',
          type: 'textarea',
          required: true,
          defaultValue:
            'Die erste Stunde ist ein Kennenlernen. Du wählst, ob online über Sophies Safe Space oder im Studio.',
        },
      ],
    },
  ],
};

import type { CollectionConfig } from 'payload';

import { eigenesOderAdmin, istAdmin, istAdminFeld } from '../access';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Benutzer', plural: 'Benutzer' },
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'] },
  auth: {
    tokenExpiration: 60 * 60 * 2, // Sitzung: zwei Stunden
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // Sperre nach fünf Fehlversuchen: zehn Minuten
    useAPIKey: false,
    verify: false,
    cookies: {
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'Lax',
    },
  },
  access: {
    // Nur Admins legen Benutzer an oder löschen sie. Den ersten Benutzer legt der Einrichtungsdialog an.
    create: istAdmin,
    delete: istAdmin,
    read: eigenesOderAdmin,
    update: eigenesOderAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'role',
      label: 'Rolle',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Redaktion (Inhalte bearbeiten)', value: 'editor' },
        { label: 'Admin (alles)', value: 'admin' },
      ],
      access: {
        // Die Rolle darf nur ein Admin ändern, sonst könnte sich jeder selbst befördern.
        create: istAdminFeld,
        update: istAdminFeld,
      },
    },
  ],
};

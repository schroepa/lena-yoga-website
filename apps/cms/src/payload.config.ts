import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Audio } from './collections/Audio';
import { Courses } from './collections/Courses';
import { Faqs } from './collections/Faqs';
import { Guides } from './collections/Guides';
import { Media } from './collections/Media';
import { Meditations } from './collections/Meditations';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { Navigation } from './globals/Navigation';
import { SiteSettings } from './globals/SiteSettings';
import { leseUmgebung } from './lib/env';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const umgebung = leseUmgebung();

/** Dateien liegen öffentlich lesbar im Bucket und werden direkt von dort ausgeliefert (schnell, ohne CMS). */
const dateiAdresse = ({ filename, prefix }: { filename: string; prefix?: string }): string =>
  `${umgebung.medien?.oeffentlicheAdresse ?? ''}/${prefix ? `${prefix}/` : ''}${encodeURIComponent(filename)}`;

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Lena Yoga CMS',
      robots: 'noindex, nofollow',
    },
  },
  collections: [Users, Media, Audio, Courses, Meditations, Posts, Guides, Faqs],
  globals: [SiteSettings, Navigation],
  editor: lexicalEditor(),
  secret: umgebung.secret,
  db: postgresAdapter({
    // Wenige Verbindungen, damit die kleine Datenbank im Gratis-Tarif nicht überlastet wird.
    pool: { connectionString: umgebung.datenbank, max: 5 },
    // Im Betrieb ändert sich das Schema nur über geprüfte Migrationen.
    push: !umgebung.istProduktion,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  // Es gibt keine GraphQL-Schnittstelle. Weniger Angriffsfläche.
  graphQL: { disable: true },
  // Nur die öffentliche Seite und das CMS selbst dürfen die API aus dem Browser aufrufen.
  cors: umgebung.erlaubteHerkuenfte,
  csrf: umgebung.erlaubteHerkuenfte,
  upload: { limits: { fileSize: 60 * 1024 * 1024 } },
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: [
    ...(umgebung.medien
      ? [
          s3Storage({
            collections: {
              media: { disablePayloadAccessControl: true, generateFileURL: dateiAdresse },
              audio: { disablePayloadAccessControl: true, generateFileURL: dateiAdresse },
            },
            bucket: umgebung.medien.bucket,
            config: {
              region: 'auto',
              endpoint: umgebung.medien.endpunkt,
              forcePathStyle: true,
              credentials: {
                accessKeyId: umgebung.medien.zugangsschluessel,
                secretAccessKey: umgebung.medien.geheimerSchluessel,
              },
            },
          }),
        ]
      : []),
  ],
});

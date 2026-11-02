import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
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
    pool: { connectionString: umgebung.datenbank },
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
    ...(umgebung.blobToken
      ? [
          vercelBlobStorage({
            collections: { media: true, audio: true },
            token: umgebung.blobToken,
          }),
        ]
      : []),
  ],
});

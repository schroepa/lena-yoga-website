import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 120_000,
    // Alle Tests teilen sich eine Datenbank und laufen deshalb nacheinander.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      PAYLOAD_SECRET: 'nur-fuer-tests-nur-fuer-tests-nur-fuer-tests-0123456789',
      DATABASE_URL:
        process.env['TEST_DATABASE_URL'] ?? 'postgres://lena@127.0.0.1:54329/lena_cms_test',
    },
  },
});

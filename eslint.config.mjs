import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.vercel/**',
      '**/.lighthouseci/**',
      '**/playwright-report/**',
      '**/test-results/**',
      'packages/tokens/**',
      '**/.next/**',
      'apps/cms/src/payload-types.ts',
      'apps/cms/src/migrations/**',
      'apps/cms/src/app/(payload)/admin/importMap.js',
      'apps/cms/next-env.d.ts',
      '.superpowers/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-strict'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        project: ['./apps/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      // TypeScript (noPropertyAccessFromIndexSignature) verlangt bei process.env die Klammerschreibweise.
      '@typescript-eslint/dot-notation': 'off',
    },
  },
  {
    // JSX-Ausdrücke in .astro-Dateien haben für den Typprüfer keinen Rückgabetyp (bekannte Einschränkung).
    files: ['**/*.astro'],
    rules: { '@typescript-eslint/no-unsafe-return': 'off' },
  },
  {
    // Payload-Hooks sind laut Bibliothek mit any getypt.
    files: ['apps/cms/src/hooks/**/*.ts'],
    rules: { '@typescript-eslint/no-unsafe-return': 'off' },
  },
  {
    // Kommandozeilen-Skripte dürfen ausgeben.
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
  {
    // Keine Typprüfung für reine JS/MJS-Konfigurationen.
    files: ['**/*.mjs', '**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);

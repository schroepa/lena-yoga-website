// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// Öffentliche Adresse. Wird in Vercel über die Umgebungsvariable gesetzt.
const site = process.env['PUBLIC_SITE_URL'] ?? 'https://lena-yoga.example';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Kleine Stylesheets direkt in die Seite, kein zusätzlicher Request vor dem ersten Bild.
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  markdown: { syntaxHighlight: false },
  integrations: [sitemap()],
  security: {
    // Hashes für eigene Skripte und Styles. Alles andere ist verboten.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "manifest-src 'self'",
      ],
    },
  },
  image: {
    // Responsive Bilder, nur eigene Quellen.
    layout: 'constrained',
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Fraunces',
      cssVariable: '--font-heading',
      weights: ['400'],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['Georgia', 'serif'],
      optimizedFallbacks: true,
    },
    {
      provider: fontProviders.fontsource(),
      name: 'DM Sans',
      cssVariable: '--font-body',
      weights: ['400', '600'],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['system-ui', 'sans-serif'],
      optimizedFallbacks: true,
    },
  ],
});

import { withPayload } from '@payloadcms/next/withPayload';

/**
 * Sicherheits-Header für das CMS.
 * Das Admin-Backend braucht inline Skripte und Styles (Next.js und Payload),
 * deshalb ist die CSP hier weniger streng als auf der öffentlichen Seite.
 * Alles, was Einbettung, Fremdquellen und Formulare betrifft, bleibt streng.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
  "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.public.blob.vercel-storage.com https://vercel.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const sicherheitsHeader = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Das CMS soll nie von Suchmaschinen erfasst werden.
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/', destination: '/admin', permanent: false }];
  },
  async headers() {
    return [{ source: '/(.*)', headers: sicherheitsHeader }];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });

// La app (HTML/JS/CSS + Supabase) vive en /public y se sirve tal cual.
// Next.js aporta: rutas limpias, cabeceras de seguridad y rutas de servidor (/api, /supabase-config.js).

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ');

const SEGURIDAD = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // En desarrollo Next necesita eval; la política estricta solo en producción
  ...(process.env.NODE_ENV === 'production' ? [{ key: 'Content-Security-Policy', value: CSP }] : [])
];

// Páginas privadas o personales: fuera de buscadores
const NO_INDEXAR = ['/admin', '/index.html', '/editor.html', '/login.html', '/respuestas.html', '/solicitudes.html',
  '/novios', '/novios.html', '/invitation.html', '/api/:ruta*'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // La ruta de vista previa (WhatsApp) lee invitation.html del disco
  outputFileTracingIncludes: { '/api/invitacion': ['./public/invitation.html'] },
  async rewrites() {
    return {
      beforeFiles: [
        // Invitación real (con ?id=): vista previa con foto y nombres al compartir el enlace
        { source: '/invitation.html', has: [{ type: 'query', key: 'id' }], destination: '/api/invitacion' },
        { source: '/', destination: '/landing.html' },
        { source: '/admin', destination: '/index.html' },
        { source: '/novios', destination: '/novios.html' },
        { source: '/privacidad', destination: '/privacidad.html' },
        { source: '/ejemplos/:plantilla', destination: '/invitation.html?demo=:plantilla' },
      ],
    };
  },
  async headers() {
    return [
      { source: '/:ruta*', headers: SEGURIDAD },
      ...NO_INDEXAR.map(source => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] })),
    ];
  },
};

export default nextConfig;

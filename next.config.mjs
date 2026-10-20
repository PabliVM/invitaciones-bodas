// La app legacy (HTML/JS/CSS + Firebase CDN) vive en /public y se sirve tal cual.
// Rutas nuevas en React → crear en /app.
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/index.html' },
      ],
    };
  },
};

export default nextConfig;

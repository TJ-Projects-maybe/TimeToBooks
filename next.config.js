/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SSR for Firebase compatibility (client-side only)
  output: 'standalone',
  // Disable image optimization for standalone output
  images: {
    unoptimized: true,
  },
  // Exclude Firebase from server-side bundling
  serverExternalPackages: ['firebase'],
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for Vercel deployment
  output: 'standalone',
  // Disable image optimization for standalone output
  images: {
    unoptimized: true,
  },
  // Exclude Firebase from server-side bundling
  serverExternalPackages: ['firebase'],
};

module.exports = nextConfig;

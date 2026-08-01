/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for Firebase compatibility
  images: {
    unoptimized: true,
  },
  // Exclude Firebase from server-side bundling
  serverExternalPackages: ['firebase'],
};

module.exports = nextConfig;

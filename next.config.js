/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SSR completely for Firebase compatibility
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Force dynamic rendering for all pages
  reactStrictMode: true,
};

module.exports = nextConfig;

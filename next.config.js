/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable all server-side rendering for Firebase compatibility
  output: 'export',
  // This will generate static files that can be served anywhere
  images: {
    unoptimized: true,
  },
  // Disable server components
  experimental: {
    serverComponentsExternalPackages: ['firebase'],
  },
};

module.exports = nextConfig;

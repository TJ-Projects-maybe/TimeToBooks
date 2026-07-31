/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for Firebase compatibility
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for static export compatibility
  trailingSlash: true,
  // Exclude Firebase from server-side bundling
  serverExternalPackages: ['firebase'],
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for Firebase compatibility
  images: {
    unoptimized: true,
  },
  // Exclude Firebase from server-side bundling (for Webpack)
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;

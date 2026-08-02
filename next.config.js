/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add empty turbopack config to silence the warning
  turbopack: {},
  // Force Webpack compiler (disable Turbopack)
  experimental: {
    forceSwcTransforms: false,
  },
  // Disable image optimization for Firebase compatibility
  images: {
    unoptimized: true,
  },
  // Webpack-specific config for Firebase
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;

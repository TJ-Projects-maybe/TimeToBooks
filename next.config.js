/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
        pathname: '/**',
      },
    ],
    // Optimize images for modern formats
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for art directed images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache lifetime in seconds
    minimumCacheTTL: 60,
  },
  
  // Enable experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable parallel routes
    ppr: false,
    // Enable server components external packages
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      // Redirect from root to dashboard if logged in
      // This would be handled client-side in your app
    ]
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for Supabase and other Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: false,
      }
    }
    
    return config
  },
  
  // Compression
  compress: true,
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Output standalone for Docker
  output: 'standalone',
  
  // Disable telemetry
  telemetry: false,
}

module.exports = nextConfig

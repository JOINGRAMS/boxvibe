import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow importing from local workspace packages
  transpilePackages: ['@boxvibe/ui', '@boxvibe/db', '@boxvibe/utils'],
  images: {
    remotePatterns: [
      {
        // Supabase Storage
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Legacy GRAMS images and any other external CDN
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig

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
    ],
  },
}

export default nextConfig

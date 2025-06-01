import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // This tells Next.js to generate static HTML

  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
        unoptimized: true, // images will be served as is

    remotePatterns: [
      
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_LOGIN_API
const PROXY_PATH = process.env.NEXT_PUBLIC_PROXY_PATH

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: `/api/${PROXY_PATH}/:path*`,
        destination: `${API_URL}/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

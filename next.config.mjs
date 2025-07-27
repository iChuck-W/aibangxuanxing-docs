import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-9afd37582afd4e23a5f8075515d93ece.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs/documentation/introduction',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/api/llms.mdx/:path*',
      },
    ];
  },
};

export default withMDX(config);

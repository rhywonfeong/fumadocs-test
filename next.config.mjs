import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image-bed-1315938829.cos.ap-nanjing.myqcloud.com',
      },
    ],
    unoptimized: true,
  },
};

export default withMDX(config);

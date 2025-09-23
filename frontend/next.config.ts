import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'images.pexels.com'],
  },
};

export default nextConfig;

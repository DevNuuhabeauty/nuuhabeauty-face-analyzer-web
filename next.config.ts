import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    CONCERN_API_URL: process.env.CONCERN_API_URL,
    SHOW_DISCLAMER: process.env.SHOW_DISCLAMER,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'heifereum-bucket.sgp1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'nuhabeauty.com',
      },
    ],
  },
};

export default nextConfig;

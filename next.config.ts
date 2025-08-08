import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
      
    ],
    domains: [
      "qyhzkprb5ofmir5x.public.blob.vercel-storage.com",
    ],
  },
};

export default nextConfig;



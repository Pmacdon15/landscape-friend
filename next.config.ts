import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ugojuoyfyrxkjqju.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qyhzkprb5ofmir5x.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  typedRoutes: true,
  experimental: {
    ppr: "incremental",
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;

//  experimental: {
//     ppr: "incremental"
//   }
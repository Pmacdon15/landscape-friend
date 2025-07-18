import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [new URL('https://maps.googleapis.com/**')],
  },

};

export default nextConfig;

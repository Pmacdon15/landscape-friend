import type { NextConfig } from 'next'

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
		ppr: 'incremental',
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
	allowedDevOrigins: ['http://localhost:3000', 'http://10.0.0.150:*'],
}

export default nextConfig

//  experimental: {
//     ppr: "incremental"
//   }

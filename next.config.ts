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
	cacheComponents: true,
	// allowedDevOrigins: ['http://localhost:3000', 'http://10.0.0.150:*'],
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
}

export default nextConfig


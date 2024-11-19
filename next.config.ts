import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	async redirects() {
		return [
			{
				source: '/',
				destination: '/login',
				permanent: true,
			},
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'maps.gstatic.com',
				pathname: '/mapfiles/place_api/icons/**',
			},
		],
	},
}

export default nextConfig

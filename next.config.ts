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
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'api.dicebear.com',
				pathname: '/9.x/initials/svg/**',
			},
		],
		dangerouslyAllowSVG: true,
	},
}

export default nextConfig

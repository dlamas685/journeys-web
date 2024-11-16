import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default withPWA({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
})(nextConfig)

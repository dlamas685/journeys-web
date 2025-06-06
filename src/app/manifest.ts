import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		theme_color: '#f87315',
		background_color: '#fdf7f0',
		display: 'standalone',
		scope: '/',
		start_url: '/',
		name: 'Journeys',
		short_name: 'Journeys',
		description: 'Aplicación para optimizar viajes y rutas',
		orientation: 'portrait',
		icons: [
			{
				src: '/icons/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icons/icon-256x256.png',
				sizes: '256x256',
				type: 'image/png',
			},
			{
				src: '/icons/icon-384x384.png',
				sizes: '384x384',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	}
}

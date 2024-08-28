import Spinner from '@/common/components/ui/misc/spinner'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { primaryFont, secondaryFont } from '@/config/fonts.config'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'Journeys • Routes',
	description: 'Aplicación para optimizar viajes y rutas',
	authors: [
		{
			name: 'Daniel Lamas',
		},
		{
			name: 'Joaquín Macaroff',
		},
	],
	keywords: [
		'viajes',
		'rutas',
		'optimización',
		'transporte',
		'logística',
		'planificación',
		'itinerarios',
		'recursos',
		'uso empresarial',
		'uso personal',
	],
	creator: 'Journeys',
	publisher: 'Journeys',
	manifest: '/manifest.json',
	icons: {
		apple: '/icons/icon-192x192.png',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='es' suppressHydrationWarning>
			<body className={cn(primaryFont.variable, secondaryFont.variable)}>
				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					enableSystem
					disableTransitionOnChange>
					{children}
				</ThemeProvider>
				<Toaster richColors />
				<Spinner />
			</body>
		</html>
	)
}

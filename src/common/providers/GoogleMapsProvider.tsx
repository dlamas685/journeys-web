'use client'
import { APIProvider } from '@vis.gl/react-google-maps'
import { ReactNode } from 'react'

type Props = {
	apiKey?: string
	children: ReactNode
}

const GoogleMapsProvider = ({ apiKey = '', children }: Readonly<Props>) => {
	return <APIProvider apiKey={apiKey}>{children}</APIProvider>
}

export default GoogleMapsProvider

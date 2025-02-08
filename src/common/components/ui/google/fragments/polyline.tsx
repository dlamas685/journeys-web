'use client'

import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'

type Props = {
	encodedPolyline: string
}

const Polyline = ({ encodedPolyline }: Readonly<Props>) => {
	const map = useMap()

	const maps = useMapsLibrary('maps')

	const geometry = useMapsLibrary('geometry')

	useEffect(() => {
		if (!maps || !map || !geometry) return

		const poly = new maps.Polyline({
			path: geometry.encoding.decodePath(encodedPolyline),
			strokeColor: '#000',
			strokeOpacity: 0.8,
			strokeWeight: 3,
		})

		poly.setMap(map)

		return () => {
			poly.setMap(null)
		}
	}, [maps, map, geometry, encodedPolyline])

	return null
}

export default Polyline

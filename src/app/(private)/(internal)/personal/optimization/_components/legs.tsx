import Polyline from '@/common/components/ui/google/fragments/polyline'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { RouteModel } from '../_models'

type Props = {
	route: RouteModel
}

const Legs = ({ route }: Readonly<Props>) => (
	<ul
		role='list'
		className='flex max-h-96 flex-col gap-3 overflow-auto px-4 font-secondary text-sm text-muted-foreground sm:mt-2 sm:max-h-[inherit] sm:px-0'>
		{route.legs.map((leg, index) => (
			<li
				role='listitem'
				key={leg.encodedPolyline}
				className='flex flex-col gap-1'>
				<span className='font-medium text-foreground underline'>
					Tramo #{index + 1}
				</span>
				<ul role='list'>
					<li role='listitem'>Distancia: {leg.localizedValues.distance}</li>
					<li role='listitem'>
						Duración: {leg.localizedValues.staticDuration}
					</li>
					<li role='listitem'>
						Costo de peaje:{' '}
						{leg.travelAdvisory.tollInfo.estimatedPrice &&
						leg.travelAdvisory.tollInfo.estimatedPrice.length > 0 ? (
							<>
								{leg.travelAdvisory.tollInfo.estimatedPrice.at(0)?.units}{' '}
								{leg.travelAdvisory.tollInfo.estimatedPrice.at(0)?.currencyCode}
							</>
						) : (
							' - '
						)}
					</li>
					<li role='listitem'>
						<Map
							className='h-40 w-full'
							defaultCenter={{
								lat: leg.startLocation.latitude,
								lng: leg.startLocation.longitude,
							}}
							defaultZoom={12}
							disableDefaultUI={true}
							zoomControl={true}
							fullscreenControl={true}
							reuseMaps
							mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}>
							<Polyline encodedPolyline={leg.encodedPolyline} />

							<AdvancedMarker
								position={{
									lat: leg.startLocation.latitude,
									lng: leg.startLocation.longitude,
								}}>
								<Pin
									background='#f9802d'
									borderColor='#ac581f'
									glyphColor='#ffb92e'
								/>
							</AdvancedMarker>

							<AdvancedMarker
								position={{
									lat: leg.endLocation.latitude,
									lng: leg.endLocation.longitude,
								}}>
								<Pin
									background='#f9802d'
									borderColor='#ac581f'
									glyphColor='#ffb92e'
								/>
							</AdvancedMarker>
						</Map>
					</li>
				</ul>
			</li>
		))}
	</ul>
)

export default Legs

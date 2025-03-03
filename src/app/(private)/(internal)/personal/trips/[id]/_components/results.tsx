'use client'
import Polyline from '@/common/components/ui/google/fragments/polyline'
import DirectionIcon from '@/common/components/ui/icons/direction-icon'
import SegmentIcon from '@/common/components/ui/icons/segment-icon'
import StopIcon from '@/common/components/ui/icons/stop-icon'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { Route, SquareChartGantt } from 'lucide-react'
import { useState } from 'react'
import Criteria from '../../../optimization/_components/criteria'
import Indications from '../../../optimization/_components/indications'
import Legs from '../../../optimization/_components/legs'
import Stops from '../../../optimization/_components/stops'
import { ROUTE_LABELS } from '../../../optimization/_constants/route-labels.constants'
import { CriteriaModel, RouteModel } from '../../../optimization/_models'
import { toPresets } from '../../_utils'

type Props = {
	criteria: CriteriaModel
	routes: RouteModel[]
}

const Results = ({ criteria, routes }: Readonly<Props>) => {
	const [currentRoute, setCurrentRoute] = useState<RouteModel>(routes[0])

	const presets = toPresets(criteria)

	const isDesktop = useMediaQuery('(min-width: 640px)')

	return (
		<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:px-2'>
			<section className='grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-6'>
				<ul
					role='list'
					className={cn(
						'flex flex-wrap divide-accent font-secondary text-sm font-medium text-muted-foreground sm:block',
						{
							'divide-y': isDesktop,
							'divide-x': !isDesktop,
						}
					)}>
					{routes.map((route, index) => (
						<li
							key={route.id}
							className={cn(
								'flex cursor-pointer items-center justify-center gap-1 rounded-md px-4 py-2 uppercase transition-all duration-200',
								{
									'bg-primary/10 text-primary': currentRoute.id === route.id,
								}
							)}
							onClick={() => setCurrentRoute(route)}>
							<Route className='size-4' />
							Ruta {String.fromCharCode(65 + index)}
						</li>
					))}
				</ul>

				<section className='flex flex-col gap-2 font-secondary sm:gap-3'>
					<dl className='text-sm text-muted-foreground'>
						<dt className='font-medium text-foreground'>Métricas</dt>
						<dd className='flex flex-col gap-2 sm:gap-3'>
							<dl className='grid grid-cols-2 sm:grid-cols-[1fr_auto]'>
								<dt>Distancia:</dt>
								<dd>{currentRoute.localizedValues.distance}</dd>
								<dt>Duración:</dt>
								<dd>{currentRoute.localizedValues.duration}</dd>
								<dt>Duración estática:</dt>
								<dd>{currentRoute.localizedValues.staticDuration}</dd>
								<dt>Costo de peaje</dt>
								<dd>
									{currentRoute.travelAdvisory.tollInfo.estimatedPrice.length >
									0 ? (
										<>
											{
												currentRoute.travelAdvisory.tollInfo.estimatedPrice.at(
													0
												)?.units
											}{' '}
											{
												currentRoute.travelAdvisory.tollInfo.estimatedPrice.at(
													0
												)?.currencyCode
											}
										</>
									) : (
										'-'
									)}
								</dd>
								<dt>Paradas</dt>
								<dd>{currentRoute.stops.length}</dd>
								<dt>Puntos de paso</dt>
								<dd>{currentRoute.passages.length}</dd>
								<dt>Tramos</dt>
								<dd>{currentRoute.legs.length}</dd>
							</dl>
						</dd>
					</dl>

					<div className='flex flex-wrap gap-1'>
						{currentRoute.routeLabels.map(label => (
							<Badge key={label} variant='secondary'>
								{ROUTE_LABELS[label]}
							</Badge>
						))}
					</div>

					<section className='flex flex-wrap gap-2 sm:gap-3'>
						{currentRoute.stops.length > 0 && (
							<ResponsiveSheet
								title='Paradas'
								description='Detalles de las paradas en la ruta.'
								label='Paradas'
								icon={<StopIcon className='size-4' />}
								triggerProps={{
									size: 'sm',
								}}>
								<Stops route={currentRoute} />
							</ResponsiveSheet>
						)}

						{currentRoute.legs.length > 1 && (
							<ResponsiveSheet
								title='Tramos de la ruta'
								description='Segmentos entre el origen, el destino y cada parada en la ruta.'
								label='Tramos'
								icon={<SegmentIcon className='size-4' />}
								triggerProps={{
									size: 'sm',
								}}>
								<Legs route={currentRoute} />
							</ResponsiveSheet>
						)}

						{presets.advanced && (
							<ResponsiveSheet
								title='Instrucciones de navegación'
								description='Recorrido detallado con las instrucciones de navegación para cada tramo de la ruta.'
								label='Instrucciones'
								icon={<DirectionIcon className='size-4' />}
								triggerProps={{
									size: 'sm',
								}}>
								<Indications route={currentRoute} />
							</ResponsiveSheet>
						)}

						<ResponsiveSheet
							title='Criterios de optimización'
							description='Criterios que se han seleccionado y aplicado en la optimización.'
							label='Criterios'
							icon={<SquareChartGantt className='size-4' />}
							triggerProps={{
								size: 'sm',
							}}>
							<Criteria presets={presets} />
						</ResponsiveSheet>
					</section>
				</section>
			</section>

			<Map
				className='h-96 w-full'
				defaultCenter={{
					lat: presets.basic.origin.location.latitude,
					lng: presets.basic.origin.location.longitude,
				}}
				defaultZoom={12}
				disableDefaultUI={true}
				zoomControl={true}
				fullscreenControl={true}
				reuseMaps
				mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}>
				<Polyline encodedPolyline={currentRoute.encodedPolyline} />

				<AdvancedMarker
					position={{
						lat: presets.basic.origin.location.latitude,
						lng: presets.basic.origin.location.longitude,
					}}>
					<Pin
						background='#f9802d'
						borderColor='#ac581f'
						glyphColor='#ffb92e'
					/>
				</AdvancedMarker>

				<AdvancedMarker
					position={{
						lat: presets.basic.destination.location.latitude,
						lng: presets.basic.destination.location.longitude,
					}}>
					<Pin
						background='#f9802d'
						borderColor='#ac581f'
						glyphColor='#ffb92e'
					/>
				</AdvancedMarker>

				{currentRoute.stops.map(passage => (
					<AdvancedMarker
						key={passage.placeId}
						position={{
							lat: passage.location.latitude,
							lng: passage.location.longitude,
						}}>
						<Pin
							background='#f87171'
							borderColor='#ef4444'
							glyphColor='#fecaca'
						/>
					</AdvancedMarker>
				))}

				{currentRoute.passages.map(stop => (
					<AdvancedMarker
						key={stop.placeId}
						position={{
							lat: stop.location.latitude,
							lng: stop.location.longitude,
						}}>
						<Pin
							background='#10b981'
							borderColor='#059669'
							glyphColor='#6ee7b7'
						/>
					</AdvancedMarker>
				))}
			</Map>
		</section>
	)
}

export default Results

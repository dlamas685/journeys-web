'use client'

import { useMediaQuery } from '@/common/hooks/use-media-query'
import {
	convertToHHMM,
	convertToSeconds,
	formatTimeShort,
} from '@/common/utils'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SquareChartGantt } from 'lucide-react'
import { useState } from 'react'
import {
	EXTRA_COMPUTATIONS,
	REFERENCE_ROUTES,
	ROUTING_PREFERENCES,
	TRAFFIC_MODELS,
	TRAVEL_MODES,
	VEHICLE_EMISSION_TYPES,
} from '../_constants'
import { RoutingPreference, TravelMode } from '../_enums'
import { PresetsModel } from '../_models'

type Props = {
	presets: PresetsModel
	label: string
	title: string
	description: string
}

const OptimizationPreview = ({
	presets,
	label,
	title,
	description,
}: Readonly<Props>) => {
	const [open, setOpen] = useState<boolean>(false)
	const isDesktop = useMediaQuery('(min-width: 640px)')

	if (isDesktop) {
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button type='button'>
						<SquareChartGantt className='mr-1 size-4' />
						{label}
					</Button>
				</SheetTrigger>
				<SheetContent className='overflow-y-auto sm:max-w-2xl'>
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
						<SheetDescription>{description}</SheetDescription>
					</SheetHeader>

					<section className='mt-2 flex flex-col gap-4'>
						<article className='font-secondary'>
							<h2 className='text-base font-semibold text-foreground'>
								Básicos
							</h2>

							<dl className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm text-muted-foreground'>
								<dt>Origen:</dt>
								<dd>{presets.basic.origin?.address}</dd>

								<dt>Destino:</dt>
								<dd>{presets.basic.destination?.address}</dd>

								<dt>Fecha de salida:</dt>
								<dd>
									{format(new Date(presets.basic.departure.date), 'PPP', {
										locale: es,
									})}
								</dd>

								<dt>Hora de salida:</dt>
								<dd>{presets.basic.departure.time}</dd>

								<dt>Puntos de interés:</dt>
								<dd>
									<ul role='list'>
										{presets.basic.intermediates?.map(intermediate => (
											<li key={intermediate.placeId}>{intermediate.address}</li>
										))}
									</ul>
								</dd>

								<dt>Tipo de vehículo:</dt>
								<dd>{TRAVEL_MODES[presets.basic.travelMode as TravelMode]}</dd>

								<dt>Consideraciones de tráfico:</dt>
								<dd>
									{
										ROUTING_PREFERENCES[
											presets.basic.routingPreference as RoutingPreference
										]
									}
								</dd>

								<dt>Otras consideraciones:</dt>
								<dd>
									<ul role='list'>
										<li>
											Evitar peajes:{' '}
											{presets.basic.routeModifiers?.avoidTolls ? 'Sí' : 'No'}
										</li>
										<li>
											Evitar autopistas:{' '}
											{presets.basic.routeModifiers?.avoidHighways
												? 'Sí'
												: 'No'}
										</li>
										<li>
											Evitar transbordadores:{' '}
											{presets.basic.routeModifiers?.avoidFerries ? 'Sí' : 'No'}
										</li>
									</ul>
								</dd>
							</dl>
						</article>

						{presets.advanced && (
							<article className='font-secondary'>
								<h2 className='text-base font-semibold text-foreground'>
									Avanzados
								</h2>

								<dl className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm text-muted-foreground'>
									<dt>Cálculos adicionales:</dt>
									<dd>
										<ul role='list'>
											{presets.advanced.extraComputations?.map(
												extraComputation => (
													<li key={extraComputation}>
														{EXTRA_COMPUTATIONS[extraComputation]}
													</li>
												)
											)}
										</ul>
									</dd>

									<dt>Modelo de tráfico:</dt>
									<dd>
										{presets.advanced.trafficModel &&
										presets.advanced.travelMode === TravelMode.DRIVE &&
										presets.advanced.routingPreference ===
											RoutingPreference.TRAFFIC_AWARE_OPTIMAL
											? TRAFFIC_MODELS[presets.advanced.trafficModel]
											: 'No compatible'}
									</dd>

									<dt>Ruta de referencia:</dt>
									<dd>
										{presets.advanced.intermediates?.length === 0
											? presets.advanced.requestedReferenceRoutes
												? REFERENCE_ROUTES[
														presets.advanced.requestedReferenceRoutes[0]
													]
												: 'No'
											: 'No compatible'}
									</dd>

									<dt>Rutas alternativas:</dt>
									<dd>
										{presets.advanced.intermediates?.length === 0
											? presets.advanced.computeAlternativeRoutes
												? 'Sí'
												: 'No'
											: 'No compatible'}
									</dd>

									<dt>Tipo de emisión del vehículo:</dt>
									<dd>
										{presets.advanced.travelMode === TravelMode.DRIVE
											? presets.advanced.routeModifiers?.vehicleInfo
													?.emissionType
												? VEHICLE_EMISSION_TYPES[
														presets.advanced.routeModifiers.vehicleInfo
															.emissionType
													]
												: 'No especifica consumo de combustible'
											: 'No compatible'}
									</dd>

									{presets.advanced.intermediates && (
										<>
											<dt>Paradas:</dt>
											<dd>
												{presets.advanced.intermediates.every(
													waypoint => waypoint.vehicleStopover
												) ? (
													<ul role='list'>
														{presets.advanced.intermediates
															.filter(waypoint => waypoint.vehicleStopover)
															.map(waypoint => (
																<li role='listitem' key={waypoint.placeId}>
																	{waypoint.address} (
																	{waypoint.activities &&
																		formatTimeShort(
																			convertToHHMM(
																				waypoint.activities.reduce(
																					(acc, activity) =>
																						acc +
																						convertToSeconds(activity.duration),
																					0
																				)
																			)
																		)}
																	)
																</li>
															))}
													</ul>
												) : (
													'-'
												)}
											</dd>

											<dt>De Paso:</dt>
											<dd>
												{presets.advanced.intermediates.every(
													waypoint => !waypoint.vehicleStopover
												) ? (
													<ul role='list'>
														{presets.advanced.intermediates
															.filter(waypoint => !waypoint.vehicleStopover)
															.map(waypoint => (
																<li role='listitem' key={waypoint.placeId}>
																	{waypoint.address}
																</li>
															))}
													</ul>
												) : (
													'-'
												)}
											</dd>
										</>
									)}
								</dl>
							</article>
						)}
					</section>
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button type='button'>
					<SquareChartGantt className='mr-1 size-4' />
					{label}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className='text-left'>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	)
}

export default OptimizationPreview

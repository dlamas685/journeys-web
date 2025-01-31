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
import {
	ReferenceRoute,
	TrafficModel,
	TrafficOption,
	TravelMode,
	VehicleEmissionType,
} from '../_enums'
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
										{presets.basic.interestPoints?.map(interestPoint => (
											<li key={interestPoint.placeId}>
												{interestPoint.address}
											</li>
										))}
									</ul>
								</dd>

								<dt>Tipo de vehículo:</dt>
								<dd>{TRAVEL_MODES[presets.basic.travelMode as TravelMode]}</dd>

								<dt>Consideraciones de tráfico:</dt>
								<dd>
									{
										ROUTING_PREFERENCES[
											presets.basic.trafficOption as TrafficOption
										]
									}
								</dd>

								<dt>Otras consideraciones:</dt>
								<dd>
									<ul role='list'>
										<li>
											Evitar peajes:{' '}
											{presets.basic.modifiers?.avoidTolls ? 'Sí' : 'No'}
										</li>
										<li>
											Evitar autopistas:{' '}
											{presets.basic.modifiers?.avoidHighways ? 'Sí' : 'No'}
										</li>
										<li>
											Evitar transbordadores:{' '}
											{presets.basic.modifiers?.avoidFerries ? 'Sí' : 'No'}
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
										presets.basic.travelMode === TravelMode.DRIVE &&
										presets.basic.trafficOption ===
											TrafficOption.TRAFFIC_AWARE_OPTIMAL
											? TRAFFIC_MODELS[
													presets.advanced.trafficModel as TrafficModel
												]
											: 'No compatible'}
									</dd>

									<dt>Ruta de referencia:</dt>
									<dd>
										{presets.advanced.interestPoints?.length === 0
											? presets.advanced.requestedReferenceRoutes
												? REFERENCE_ROUTES[ReferenceRoute.SHORTER_DISTANCE]
												: 'No'
											: 'No compatible'}
									</dd>

									<dt>Rutas alternativas:</dt>
									<dd>
										{presets.advanced.interestPoints?.length === 0
											? presets.advanced.computeAlternativeRoutes
												? 'Sí'
												: 'No'
											: 'No compatible'}
									</dd>

									<dt>Tipo de emisión del vehículo:</dt>
									<dd>
										{presets.basic.travelMode === TravelMode.DRIVE
											? presets.advanced.emissionType
												? VEHICLE_EMISSION_TYPES[
														presets.advanced.emissionType as VehicleEmissionType
													]
												: 'No especifica consumo de combustible'
											: 'No compatible'}
									</dd>

									{presets.advanced.interestPoints && (
										<>
											<dt>Paradas:</dt>
											<dd>
												{presets.advanced.interestPoints.every(
													interestPoint => interestPoint.vehicleStopover
												) ? (
													<ul role='list'>
														{presets.advanced.interestPoints
															.filter(
																interestPoint => interestPoint.vehicleStopover
															)
															.map(interestPoint => (
																<li role='listitem' key={interestPoint.placeId}>
																	{interestPoint.address} (
																	{interestPoint.activities &&
																		formatTimeShort(
																			convertToHHMM(
																				interestPoint.activities.reduce(
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
												{presets.advanced.interestPoints.every(
													interestPoint => !interestPoint.vehicleStopover
												) ? (
													<ul role='list'>
														{presets.advanced.interestPoints
															.filter(
																interestPoint => !interestPoint.vehicleStopover
															)
															.map(interestPoint => (
																<li role='listitem' key={interestPoint.placeId}>
																	{interestPoint.address}
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

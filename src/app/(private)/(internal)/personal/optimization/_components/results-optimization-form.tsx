'use client'

import { create } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import Polyline from '@/common/components/ui/google/fragments/polyline'
import DirectionIcon from '@/common/components/ui/icons/direction-icon'
import SegmentIcon from '@/common/components/ui/icons/segment-icon'
import StopIcon from '@/common/components/ui/icons/stop-icon'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { ApiEndpoints } from '@/common/enums'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { convertToUTCISO, hhmmToSeconds } from '@/common/utils'
import { Badge } from '@/components/ui/badge'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { Route, SquareChartGantt } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import RiseLoader from 'react-spinners/RiseLoader'
import { CreateTripModel, TripModel } from '../../trips/_models'
import {
	computeAdvancedOptimization,
	computeBasicOptimization,
} from '../_actions/optimization.action'
import { ROUTE_LABELS } from '../_constants/route-labels.constants'
import { Steps } from '../_enums'
import { CriteriaModel, RouteModel } from '../_models'
import {
	resultsOptimizationFormSchema,
	ResultsOptimizationFormSchema,
} from '../_schemas'
import { useOptimization } from '../_store/optimization.store'
import Criteria from './criteria'
import Indications from './indications'
import Legs from './legs'
import Stops from './stops'

const ResultsOptimizationForm = () => {
	const form = useForm<ResultsOptimizationFormSchema>({
		resolver: zodResolver(resultsOptimizationFormSchema),
		defaultValues: {
			alias: '',
		},
	})

	const isDesktop = useMediaQuery('(min-width: 640px)')

	const setLoading = useLoading(state => state.setLoading)

	const setResults = useOptimization(state => state.setResults)

	const presets = useOptimization(state => state.presets)

	const results = useOptimization(state => state.results)

	const [currentRoute, setCurrentRoute] = useState<RouteModel>()

	const [criteria, setCriteria] = useState<CriteriaModel>()

	const response = useResponse()

	const [resultsLoading, setResultsLoading] = useState<boolean>(false)

	const handleFinish = useStepper(state => state.handleFinish)

	const getResults = useCallback(async () => {
		if (presets) {
			const criteria: CriteriaModel = {
				basicCriteria: {
					origin: presets.basic.origin,
					destination: presets.basic.destination,
					departureTime: convertToUTCISO(
						presets.basic.departure.date,
						presets.basic.departure.time
					),
					travelMode: presets.basic.travelMode,
					modifiers: presets.basic.modifiers,
					trafficOption: presets.basic.trafficOption,
					interestPoints: presets.basic.interestPoints,
				},
				advancedCriteria: presets.advanced
					? {
							extraComputations: presets.advanced.extraComputations,
							trafficModel: presets.advanced.trafficModel,
							optimizeWaypointOrder: presets.advanced.optimizeWaypointOrder,
							computeAlternativeRoutes:
								presets.advanced.computeAlternativeRoutes,
							requestedReferenceRoutes: presets.advanced
								.requestedReferenceRoutes
								? [presets.advanced.requestedReferenceRoutes]
								: undefined,
							interestPoints: presets.advanced.interestPoints?.map(point => ({
								...point,
								activities: point.activities?.map(activity => ({
									...activity,
									duration: hhmmToSeconds(activity.duration),
								})),
								config: point.config
									? {
											...point.config,
											templateId: point.config.templateId
												? point.config.templateId
												: undefined,
										}
									: undefined,
							})),
						}
					: undefined,
			}

			setResultsLoading(true)

			if (criteria.advancedCriteria) {
				await computeAdvancedOptimization(criteria)
					.then(response => {
						if ('error' in response) {
							throw new ApiError(response)
						}

						setResults({
							response,
						})

						setCurrentRoute(response.at(0))

						setCriteria(criteria)
					})
					.catch(response.error)
					.finally(() => setResultsLoading(false))

				return
			}

			await computeBasicOptimization(criteria.basicCriteria)
				.then(response => {
					if ('error' in response) {
						throw new ApiError(response)
					}

					setResults({
						response,
					})

					setCurrentRoute(response.at(0))

					setCriteria(criteria)
				})
				.catch(response.error)
				.finally(() => setResultsLoading(false))

			return
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmit = async (values: ResultsOptimizationFormSchema) => {
		setLoading(true)

		if (!criteria || !results) return

		const createTripModel: CreateTripModel = {
			code: values.alias,
			departureTime: criteria.basicCriteria.departureTime,
			criteria,
		}

		await create<CreateTripModel, TripModel>(
			ApiEndpoints.TRIPS,
			createTripModel
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Optimización',
					description: 'El viaje ha sido creado correctamente.',
				})

				handleFinish()
			})
			.catch(response.error)
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		getResults()
	}, [getResults])

	return (
		<Form {...form}>
			<form
				id={Steps.RESULTS.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='flex flex-col gap-4 sm:gap-6 sm:px-2'>
				<h2 className='text-base font-medium text-foreground sm:text-lg'>
					Resultados
				</h2>

				{results && currentRoute && presets && (
					<>
						<FormField
							control={form.control}
							name='alias'
							render={({ field }) => (
								<FormItem className='max-w-56'>
									<FormLabel>Alias</FormLabel>
									<FormControl>
										<Input
											placeholder='Ingrese un alias para su viaje'
											aria-label='Alias del viaje'
											aria-required='true'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Map
							className='col-span-full h-72 w-full'
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

						<section className='grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-6'>
							<ul
								role='list'
								className={cn(
									'flex divide-accent font-secondary text-sm font-medium text-muted-foreground sm:block',
									{
										'divide-y': isDesktop,
										'divide-x': !isDesktop,
									}
								)}>
								{results.response.map((route, index) => (
									<li
										key={route.id}
										className={cn(
											'flex cursor-pointer items-center justify-center gap-1 rounded-md px-4 py-2 uppercase transition-all duration-200',
											{
												'bg-primary/10 text-primary':
													currentRoute.id === route.id,
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
												{currentRoute.travelAdvisory.tollInfo.estimatedPrice
													.length > 0 ? (
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
					</>
				)}

				{resultsLoading && (
					<section className='flex h-96 w-full flex-col items-center justify-center'>
						<p className='mb-6 text-lg font-medium text-foreground'>
							Generando optimización
						</p>
						<RiseLoader loading={resultsLoading} color='#f97316' />
					</section>
				)}
			</form>
		</Form>
	)
}

export default ResultsOptimizationForm

'use client'

import { ApiError } from '@/common/classes/api-error.class'
import FormTooltip from '@/common/components/ui/form/form-tooltip'
import { Pathnames } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { sleep } from '@/common/utils'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
	EXTRA_COMPUTATIONS,
	REFERENCE_ROUTES,
	TRAFFIC_MODELS,
} from '../_constants'
import {
	ExtraComputation,
	ReferenceRoute,
	Steps,
	TrafficModel,
	TrafficOption,
	TravelMode,
} from '../_enums'
import { PresetsModel } from '../_models'
import {
	advancedOptimizationFormSchema,
	type AdvancedOptimizationFormSchema,
} from '../_schemas'
import { useOptimization } from '../_store/optimization.store'
import ActivitiesSetting from './activities-setting'

const AdvancedOptimizationForm = () => {
	const presets = useOptimization(state => state.presets)

	const router = useRouter()

	const response = useResponse()

	const canHaveTrafficModel =
		presets?.basic.trafficOption === TrafficOption.TRAFFIC_AWARE_OPTIMAL &&
		presets?.basic.travelMode === TravelMode.DRIVE

	const canHaveComputeAlternativeRoutes =
		presets?.basic.interestPoints?.length === 0

	const form = useForm<AdvancedOptimizationFormSchema>({
		resolver: zodResolver(advancedOptimizationFormSchema),
		defaultValues: {
			trafficModel: canHaveTrafficModel ? TrafficModel.BEST_GUESS : undefined,
		},
	})

	const canHaveOptimizeWaypointOrder =
		presets?.basic.interestPoints &&
		presets.basic.interestPoints.length > 0 &&
		form
			.watch('interestPoints')
			?.every(
				waypoint => waypoint.via === false && waypoint.vehicleStopover == true
			) &&
		presets?.basic.trafficOption !== TrafficOption.TRAFFIC_AWARE_OPTIMAL

	const canHaveShorterDistanceReferenceRoute =
		presets?.basic.interestPoints?.length === 0

	const setLoading = useLoading(state => state.setLoading)

	const setPresets = useOptimization(state => state.setPresets)

	const handleNext = useStepper(state => state.handleNext)

	const handleSubmit = async (values: AdvancedOptimizationFormSchema) => {
		setLoading(true)

		await sleep(1500)
			.then(() => {
				if (!presets) {
					throw new ApiError({
						error: 'Not Found',
						message: 'No se encontraron criterios básicos',
						statusCode: 404,
					})
				}

				const newPresets: PresetsModel = {
					...presets,
					advanced: {
						...values,
					},
				}

				setPresets(newPresets)

				handleNext()
			})
			.catch(error => {
				response.error(error)
				router.push(Pathnames.OPTIMIZATION)
			})
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		form.reset({
			extraComputations: presets?.advanced?.extraComputations,
			trafficModel: presets?.advanced?.trafficModel,
			computeAlternativeRoutes: presets?.advanced?.computeAlternativeRoutes,
			optimizeWaypointOrder: presets?.advanced?.optimizeWaypointOrder,
			requestedReferenceRoutes: presets?.advanced?.requestedReferenceRoutes,
			interestPoints:
				presets?.advanced?.interestPoints?.map(interestPoint => ({
					...interestPoint,
					activities: interestPoint.activities,
				})) ??
				presets?.basic.interestPoints?.map(interestPoint => ({
					...interestPoint,
					activities: [],
				})),
		})
	}, [form, presets])

	return (
		<Form {...form}>
			<form
				id={Steps.ADVANCED.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Criterios Avanzados
				</h2>

				<FormField
					control={form.control}
					name='extraComputations'
					render={() => (
						<FormItem className='col-span-full'>
							<FormLabel className='flex items-center gap-1'>
								Cálculos adicionales
								<FormTooltip>
									Incorpora información adicional que se incluirá en tu viaje
									(campo obligatorio).
								</FormTooltip>
							</FormLabel>

							<FormDescription className='sm:hidden'>
								Incorpora información adicional que se incluirá en tu viaje
								(campo obligatorio).
							</FormDescription>

							{Object.entries(EXTRA_COMPUTATIONS).map(([key, value]) => {
								const parseKey = parseInt(key, 10)

								const disabled =
									(parseKey === ExtraComputation.TOLLS &&
										(presets?.basic.modifiers?.avoidTolls ||
											presets?.basic.travelMode !== TravelMode.DRIVE)) ||
									(parseKey === ExtraComputation.TRAFFIC_ON_POLYLINE &&
										(presets?.basic.trafficOption ===
											TrafficOption.TRAFFIC_UNAWARE ||
											presets?.basic.travelMode !== TravelMode.DRIVE))

								return (
									<FormField
										key={key}
										control={form.control}
										name='extraComputations'
										render={({ field }) => {
											return (
												<FormItem
													key={key}
													className='flex flex-row items-center space-x-2 space-y-0'>
													<FormControl>
														<Checkbox
															disabled={disabled}
															checked={field.value?.includes(parseKey)}
															onCheckedChange={checked => {
																if (checked) {
																	field.onChange([
																		...(field.value ?? []),
																		parseKey,
																	])

																	parseKey ===
																		ExtraComputation.TRAFFIC_ON_POLYLINE &&
																		presets?.basic.travelMode ===
																			TravelMode.DRIVE &&
																		presets.basic.trafficOption ===
																			TrafficOption.TRAFFIC_AWARE_OPTIMAL &&
																		form.setValue(
																			'trafficModel',
																			TrafficModel.BEST_GUESS
																		)
																	return
																}

																field.onChange(
																	field.value?.filter(
																		value => value !== parseKey
																	)
																)
															}}
														/>
													</FormControl>
													<FormLabel className='font-normal'>{value}</FormLabel>
												</FormItem>
											)
										}}
									/>
								)
							})}
							<FormMessage />
						</FormItem>
					)}
				/>

				<section className='flex flex-col gap-4'>
					<FormField
						control={form.control}
						name='requestedReferenceRoutes'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center gap-1'>
									Ruta de referencia
									<FormTooltip>
										Añade de referencia la ruta con la distancia más corta,
										además de la ruta principal (solo sin puntos de interés).
									</FormTooltip>
								</FormLabel>
								<FormDescription className='sm:hidden'>
									Añade de referencia la ruta con la distancia más corta, además
									de la ruta principal (solo sin puntos de interés).
								</FormDescription>
								<FormControl>
									<FormItem className='flex flex-row items-center space-x-2 space-y-0'>
										<FormControl>
											<Checkbox
												checked={
													field.value === ReferenceRoute.SHORTER_DISTANCE
												}
												onCheckedChange={checked => {
													return checked
														? field.onChange(ReferenceRoute.SHORTER_DISTANCE)
														: field.onChange('')
												}}
												disabled={!canHaveShorterDistanceReferenceRoute}
											/>
										</FormControl>
										<FormLabel className='font-normal'>
											{REFERENCE_ROUTES[ReferenceRoute.SHORTER_DISTANCE]}
										</FormLabel>
									</FormItem>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='computeAlternativeRoutes'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center gap-1'>
									Rutas alternativas
									<FormTooltip>
										Indica si se deben calcular rutas alternativas además de la
										ruta principal (solo sin puntos de interés).
									</FormTooltip>
								</FormLabel>
								<FormDescription className='sm:hidden'>
									Indica si se deben calcular rutas alternativas además de la
									ruta principal (solo sin puntos de interés).
								</FormDescription>
								<FormControl>
									<FormItem className='flex flex-row items-center space-x-2 space-y-0'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={!canHaveComputeAlternativeRoutes}
											/>
										</FormControl>
										<FormLabel className='font-normal'>Calcular</FormLabel>
									</FormItem>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='optimizeWaypointOrder'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center gap-1'>
									Puntos de interés
									<FormTooltip>
										Indica si deseas optimizar el orden de los puntos de interés
										(solo sin puntos de interés de paso y tráfico optimizado).
									</FormTooltip>
								</FormLabel>
								<FormDescription className='sm:hidden'>
									Indica si deseas optimizar el orden de los puntos de interés
									(solo sin puntos de interés de paso y tráfico optimizado).
								</FormDescription>
								<FormControl>
									<FormItem className='flex flex-row items-center space-x-2 space-y-0'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={!canHaveOptimizeWaypointOrder}
											/>
										</FormControl>
										<FormLabel className='font-normal'>
											Optimizar orden
										</FormLabel>
									</FormItem>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</section>

				<FormField
					control={form.control}
					name='trafficModel'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Modelo de tráfico
								<FormTooltip>
									Determina como se evaluaran las condiciones de tráfico para
									calcular el tiempo estimado de viaje (solo disponible en
									automóvil, tráfico optimizado y sin trafico en tiempo real).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Determina como se evaluaran las condiciones de tráfico para
								calcular el tiempo estimado de viaje (solo disponible en
								automóvil, tráfico optimizado y sin trafico en tiempo real).
							</FormDescription>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									value={field.value}
									className='flex flex-col gap-3'>
									{Object.entries(TRAFFIC_MODELS).map(([key, value]) => (
										<FormItem
											key={key}
											className='flex items-center space-x-2 space-y-0'>
											<FormControl>
												<RadioGroupItem
													value={key}
													disabled={
														!canHaveTrafficModel ||
														form
															.watch('extraComputations')
															?.includes(ExtraComputation.TRAFFIC_ON_POLYLINE)
													}
												/>
											</FormControl>
											<FormLabel
												className={cn('font-normal', {
													'opacity-70':
														!canHaveTrafficModel ||
														form
															.watch('extraComputations')
															?.includes(ExtraComputation.TRAFFIC_ON_POLYLINE),
												})}>
												{value}
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='interestPoints'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel className='flex items-center gap-1'>
								Actividades
								<FormTooltip>
									Incorpora actividades de las plantillas para cada punto de
									interés si lo requieres.
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Incorpora actividades de las plantillas para cada punto de
								interés si lo requieres.
							</FormDescription>
							<FormControl>
								<section className='flex flex-wrap gap-2'>
									{field.value && field.value.length > 0 ? (
										field.value.map(interestPoint => (
											<ActivitiesSetting
												key={interestPoint.placeId}
												waypoint={interestPoint}
												onReady={waypoint => {
													field.onChange(
														field.value?.map(interestPoint =>
															interestPoint.placeId === waypoint.placeId
																? waypoint
																: interestPoint
														)
													)
												}}
											/>
										))
									) : (
										<p className='font-secondary text-sm text-muted-foreground'>
											No se seleccionaron puntos de interés
										</p>
									)}
								</section>
							</FormControl>
							<FormMessage />
							{/* <pre>{JSON.stringify(form.getValues(), null, 3)}</pre> */}
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default AdvancedOptimizationForm

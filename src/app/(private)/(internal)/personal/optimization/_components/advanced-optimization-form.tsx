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
	VEHICLE_EMISSION_TYPES,
} from '../_constants'
import {
	ExtraComputation,
	ReferenceRoute,
	Steps,
	TrafficModel,
	TrafficOption,
	TravelMode,
	VehicleEmissionType,
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
		form
			.watch('interestPoints')
			?.every(
				waypoint => waypoint.via === false && waypoint.vehicleStopover == true
			) && presets?.basic.trafficOption !== TrafficOption.TRAFFIC_AWARE_OPTIMAL

	const canHaveShorterDistanceReferenceRoute =
		presets?.basic.interestPoints?.length === 0

	const canHaveEmissionType = presets?.basic.travelMode === TravelMode.DRIVE

	const isEnabledEmissionType = form
		.watch('extraComputations')
		?.includes(ExtraComputation.FUEL_CONSUMPTION)

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
						...presets.basic,
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
			emissionType: presets?.advanced?.emissionType,
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
	}, [form, presets, canHaveTrafficModel])

	return (
		<Form {...form}>
			<form
				id={Steps.ADVANCED.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Criterios Avanzados
				</h2>

				<FormField
					control={form.control}
					name='extraComputations'
					render={() => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Cálculos adicionales<span className='text-orange-500'>*</span>
								<FormTooltip>
									Esto representa información adicional que se incluirá en tu
									viaje.
								</FormTooltip>
							</FormLabel>

							<FormDescription className='sm:hidden'>
								Esto representa información adicional que se incluirá en tu
								viaje.
							</FormDescription>

							{Object.entries(EXTRA_COMPUTATIONS).map(([key, value]) => {
								const parseKey = parseInt(key, 10)

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
															checked={field.value?.includes(parseKey)}
															disabled={
																(presets?.basic.modifiers?.avoidTolls &&
																	parseKey === ExtraComputation.TOLLS) ||
																((parseKey ===
																	ExtraComputation.FUEL_CONSUMPTION ||
																	parseKey === ExtraComputation.TOLLS) &&
																	!canHaveEmissionType)
															}
															onCheckedChange={checked => {
																if (checked) {
																	field.onChange([
																		...(field.value ?? []),
																		parseKey,
																	])

																	parseKey ===
																		ExtraComputation.FUEL_CONSUMPTION &&
																		form.setValue(
																			'emissionType',
																			VehicleEmissionType.GASOLINE
																		)
																	return
																}

																field.onChange(
																	field.value?.filter(
																		value => value !== parseKey
																	)
																)

																parseKey ===
																	ExtraComputation.FUEL_CONSUMPTION &&
																	form.setValue('emissionType', undefined)
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

				<FormField
					control={form.control}
					name='trafficModel'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Modelo de tráfico
								<FormTooltip>
									Determina como se evalúan las condiciones de tráfico para
									calcular el tiempo estimado de viaje (solo en automóvil y
									tráfico optimizado)
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Determina como se evalúan las condiciones de tráfico para
								calcular el tiempo estimado de viaje (solo en automóvil y
								tráfico optimizado)
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
													disabled={!canHaveTrafficModel}
												/>
											</FormControl>
											<FormLabel
												className={cn('font-normal', {
													'opacity-70': !canHaveTrafficModel,
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

				<section className='flex flex-col gap-4'>
					<FormField
						control={form.control}
						name='requestedReferenceRoutes'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center gap-1'>
									Ruta de referencia
									<FormTooltip>
										Permite solicitar un ruta de referencia adicional, además de
										la ruta principal (solo sin puntos de interés)
									</FormTooltip>
								</FormLabel>
								<FormDescription className='sm:hidden'>
									Permite solicitar un ruta de referencia adicional, además de
									la ruta principal (solo sin puntos de interés)
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
										ruta principal (solo sin puntos de interés)
									</FormTooltip>
								</FormLabel>
								<FormDescription className='sm:hidden'>
									Indica si se deben calcular rutas alternativas además de la
									ruta principal (solo sin puntos de interés)
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
										(solo sin puntos de interés de paso y tráfico optimizado)
									</FormTooltip>
								</FormLabel>
								<FormDescription className='sm:hidden'>
									Indica si deseas optimizar el orden de los puntos de interés
									(solo sin puntos de interés de paso y tráfico optimizado)
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
					name='emissionType'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Tipo de emisión del vehículo
								<FormTooltip>Especifica información del vehículo.</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Especifica información del vehículo.
							</FormDescription>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									value={field.value}
									className='flex flex-col gap-3'>
									{Object.entries(VEHICLE_EMISSION_TYPES).map(
										([key, value]) => (
											<FormItem
												key={key}
												className='flex items-center space-x-2 space-y-0'>
												<FormControl>
													<RadioGroupItem
														value={key}
														disabled={
															(canHaveEmissionType && !isEnabledEmissionType) ||
															!canHaveEmissionType
														}
													/>
												</FormControl>
												<FormLabel
													className={cn('font-normal', {
														'opacity-70':
															(canHaveEmissionType && !isEnabledEmissionType) ||
															!canHaveEmissionType,
													})}>
													{value}
												</FormLabel>
											</FormItem>
										)
									)}
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
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default AdvancedOptimizationForm

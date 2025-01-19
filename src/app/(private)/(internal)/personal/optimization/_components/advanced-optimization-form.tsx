'use client'

import { ApiError } from '@/common/classes/api-error.class'
import FormTooltip from '@/common/components/ui/form/form-tooltip'
import { Pathnames } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
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
	RoutingPreference,
	Steps,
	TollPass,
	TrafficModel,
	TravelMode,
	VehicleEmissionType,
} from '../_enums'
import { PresetsModel } from '../_models'
import {
	advancedOptimizationFormSchema,
	type AdvancedOptimizationFormSchema,
} from '../_schemas'
import { useOptimization } from '../_store/optimization.store'
import { useStepper } from '../_store/stepper.store'
import ActivitiesSetting from './activities-setting'

const AdvancedOptimizationForm = () => {
	const presets = useOptimization(state => state.presets)

	const form = useForm<AdvancedOptimizationFormSchema>({
		resolver: zodResolver(advancedOptimizationFormSchema),
	})

	const router = useRouter()

	const response = useResponse()

	const canHaveTrafficModel =
		presets?.basic.routingPreference ===
			RoutingPreference.TRAFFIC_AWARE_OPTIMAL &&
		presets?.basic.travelMode === TravelMode.DRIVE

	const canHaveComputeAlternativeRoutes =
		presets?.basic.intermediates?.length === 0

	const canHaveOptimizeWaypointOrder = form
		.watch('intermediates')
		?.some(waypoint => waypoint.via === false)

	const canHaveShorterDistanceReferenceRoute =
		presets?.basic.intermediates?.length === 0

	const canHaveEmissionType = presets?.basic.travelMode === TravelMode.DRIVE

	const isEnabledEmissionType = form
		.watch('extraComputations')
		?.includes(ExtraComputation.FUEL_CONSUMPTION)

	const setLoading = useLoading(state => state.setLoading)

	const setPresets = useOptimization(state => state.setPresets)

	const handleNext = useStepper(state => state.handleNext)

	const handleSubmit = async ({
		extraComputations,
		routeModifiers,
		requestedReferenceRoutes,
		trafficModel,
		...restValues
	}: AdvancedOptimizationFormSchema) => {
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
						extraComputations: extraComputations as ExtraComputation[],
						routeModifiers: {
							...presets.basic.routeModifiers,
							vehicleInfo: routeModifiers.vehicleInfo.emissionType
								? {
										emissionType: routeModifiers.vehicleInfo
											.emissionType as VehicleEmissionType,
									}
								: undefined,
							tollPasses: routeModifiers.tollPasses as TollPass[],
						},
						requestedReferenceRoutes: requestedReferenceRoutes
							? ([requestedReferenceRoutes] as ReferenceRoute[])
							: undefined,
						trafficModel: trafficModel as TrafficModel,
						...restValues,
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
			trafficModel: canHaveTrafficModel
				? TrafficModel.BEST_GUESS
				: presets?.advanced?.trafficModel
					? presets.advanced.trafficModel
					: undefined,
			routeModifiers: {
				vehicleInfo: presets?.advanced?.routeModifiers?.vehicleInfo
					?.emissionType
					? {
							emissionType:
								presets?.advanced?.routeModifiers?.vehicleInfo?.emissionType,
						}
					: undefined,
				tollPasses: presets?.advanced?.routeModifiers?.tollPasses,
			},
			intermediates:
				presets?.advanced?.intermediates?.map(waypoint => ({
					...waypoint,
					activities: waypoint.activities,
				})) ??
				presets?.basic.intermediates?.map(waypoint => ({
					...waypoint,
					activities: [],
				})),
			computeAlternativeRoutes: presets?.advanced?.computeAlternativeRoutes,
			optimizeWaypointOrder: presets?.advanced?.optimizeWaypointOrder,
			requestedReferenceRoutes:
				presets?.advanced?.requestedReferenceRoutes?.at(0) ?? undefined,
		})
	}, [form, presets, canHaveTrafficModel, canHaveEmissionType])

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
								Cálculos adicionales
								<FormTooltip>
									Esto representa información adicional que se incluirá en tu
									viaje.
								</FormTooltip>
							</FormLabel>

							<FormDescription className='sm:hidden'>
								Esto representa información adicional que se incluirá en tu
								viaje.
							</FormDescription>

							{Object.entries(EXTRA_COMPUTATIONS).map(([key, value]) => (
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
														checked={field.value?.includes(key)}
														disabled={
															key === ExtraComputation.FUEL_CONSUMPTION &&
															!canHaveEmissionType
														}
														onCheckedChange={checked => {
															if (checked) {
																field.onChange([...(field.value ?? []), key])
																key === ExtraComputation.TOLLS &&
																	form.setValue('routeModifiers.tollPasses', [
																		TollPass.AR_TELEPASE,
																	])

																key === ExtraComputation.FUEL_CONSUMPTION &&
																	form.setValue(
																		'routeModifiers.vehicleInfo.emissionType',
																		VehicleEmissionType.GASOLINE
																	)
																return
															}

															field.onChange(
																field.value?.filter(value => value !== key)
															)

															key === ExtraComputation.TOLLS &&
																form.setValue('routeModifiers.tollPasses', [])

															key === ExtraComputation.FUEL_CONSUMPTION &&
																form.setValue(
																	'routeModifiers.vehicleInfo.emissionType',
																	undefined
																)
														}}
													/>
												</FormControl>
												<FormLabel className='font-normal'>{value}</FormLabel>
											</FormItem>
										)
									}}
								/>
							))}
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

									{/* <RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									value={field.value}
									className='flex flex-col gap-3'>
									{Object.entries(REFERENCE_ROUTES).map(([key, value]) => (
										<FormItem
											key={key}
											className='flex items-center space-x-2 space-y-0'>
											<FormControl>
												<RadioGroupItem value={key} />
											</FormControl>
											<FormLabel className='font-normal'>{value}</FormLabel>
										</FormItem>
									))}
								</RadioGroup> */}
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
										(solo sin puntos de interés de paso)
									</FormTooltip>
								</FormLabel>
								<FormDescription className='sm:hidden'>
									Indica si deseas optimizar el orden de los puntos de interés
									(solo sin puntos de interés de paso)
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
					name='routeModifiers.vehicleInfo.emissionType'
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
					name='intermediates'
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
										field.value.map(waypoint => (
											<ActivitiesSetting
												key={waypoint.placeId}
												waypoint={waypoint}
												onReady={waypoint => {
													field.onChange(
														field.value?.map(w =>
															w.placeId === waypoint.placeId ? waypoint : w
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

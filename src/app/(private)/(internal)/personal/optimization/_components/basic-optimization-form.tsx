'use client'

import { ApiError } from '@/common/classes/api-error.class'
import FormTooltip from '@/common/components/ui/form/form-tooltip'
import InputMask from '@/common/components/ui/form/input-mask'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { computeBasicOptimization } from '../_actions/optimization.action'
import { RoutingPreference, Steps, TravelMode } from '../_enums'
import {
	BasicCriteriaModel,
	PresetsModel,
	ResultsModel,
	TimestampModel,
} from '../_models'
import {
	basicOptimizationFormSchema,
	type BasicOptimizationFormSchema,
} from '../_schemas'
import { useOptimization } from '../_store/optimization.store'
import { useStepper } from '../_store/stepper.store'
import { fromTimestamp, toTimestamp } from '../_utils'
import {
	WaypointSetting,
	WaypointSettingItem,
	WaypointSettingList,
	WaypointSettingTabs,
} from './waypoint-setting'

const BasicOptimizationForm = () => {
	const response = useResponse()

	const presets = useOptimization(state => state.presets)

	const results = useOptimization(state => state.results)

	const setLoading = useLoading(state => state.setLoading)

	const setPresets = useOptimization(state => state.setPresets)

	const setResults = useOptimization(state => state.setResults)

	const handleNext = useStepper(state => state.handleNext)

	const form = useForm<BasicOptimizationFormSchema>({
		resolver: zodResolver(basicOptimizationFormSchema),
		defaultValues: {
			travelMode: presets.basic.travelMode ?? TravelMode.DRIVE,
		},
	})

	const handleSubmit = async (values: BasicOptimizationFormSchema) => {
		const { departure, origin, destination, intermediates, ...restValues } =
			values

		//TODO: VER DE CAMBIAR PARA QUE DETECTE CAMBIOS O PENSAR UNA NUEVA UI
		if (results.basic.distance) {
			handleNext()
			return
		}

		setLoading(true)

		const departureTime: TimestampModel = toTimestamp(
			departure.date,
			departure.time
		)

		const criteria: BasicCriteriaModel = {
			origin: {
				placeId: origin.placeId,
			},
			destination: {
				placeId: destination.placeId,
			},
			intermediates: intermediates?.map(waypoint => ({
				placeId: waypoint.placeId,
			})),
			departureTime,
			...restValues,
		}

		await computeBasicOptimization(criteria)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				const presets: PresetsModel = {
					basic: {
						origin,
						destination,
						intermediates,
						departureTime,
						...restValues,
					},
				}

				const results: ResultsModel = {
					basic: resp,
				}

				setPresets(presets)

				setResults(results)

				response.success({
					title: 'Optimización',
					description:
						'Se aplicaron los criterios básicos de optimización con éxito.',
				})

				handleNext()
			})
			.catch(response.error)
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		const [date, time] = presets.basic.departureTime
			? fromTimestamp(presets.basic.departureTime)
			: []

		form.reset({
			origin: presets.basic.origin ?? undefined,
			destination: presets.basic.destination ?? undefined,
			travelMode: presets.basic.travelMode ?? 'DRIVE',
			intermediates: presets.basic.intermediates ?? [],
			departure:
				date && time
					? {
							date,
							time,
						}
					: undefined,
			routingPreference: presets.basic.routingPreference,
			routeModifiers: presets.basic.routeModifiers,
		})
	}, [presets, form])

	return (
		<Form {...form}>
			<form
				id={Steps.BASIC.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Criterios Básicos
				</h2>

				<FormField
					control={form.control}
					name='origin'
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Origen
								<FormTooltip>
									Indica la dirección o lugar desde donde comenzarás tu viaje.
								</FormTooltip>
							</FormLabel>

							<FormDescription className='sm:hidden'>
								Indica la dirección o lugar desde donde comenzarás tu viaje.
							</FormDescription>
							<FormControl>
								<WaypointSetting
									title='Origen'
									description='Indica la dirección o lugar desde donde comenzarás tu viaje.'
									onReady={waypoints => {
										field.onChange(waypoints[0])
									}}
									value={field.value ? [field.value] : []}>
									<WaypointSettingTabs />
									{field.value?.address && (
										<WaypointSettingList>
											<WaypointSettingItem
												waypoint={field.value}
												onRemove={() => form.resetField('origin')}
											/>
										</WaypointSettingList>
									)}
								</WaypointSetting>
							</FormControl>

							<FormMessage />
							{/* 
							<pre>{JSON.stringify(fieldState.error, null, 2)}</pre>
							<pre>{JSON.stringify(field.value, null, 2)}</pre> */}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='destination'
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Destino
								<FormTooltip>
									Especifica el lugar al que deseas llegar.
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Especifica el lugar al que deseas llegar.
							</FormDescription>
							<FormControl>
								<WaypointSetting
									title='Destino'
									description='Especifica el lugar al que deseas llegar.'
									onReady={waypoints => {
										field.onChange(waypoints[0])
									}}
									value={field.value ? [field.value] : []}>
									<WaypointSettingTabs />
									{field.value?.address && (
										<WaypointSettingList>
											<WaypointSettingItem
												waypoint={field.value}
												onRemove={() => form.resetField('destination')}
											/>
										</WaypointSettingList>
									)}
								</WaypointSetting>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='departure.date'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Fecha de salida
								<FormTooltip>Selecciona la fecha de salida.</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Selecciona la fecha de salida.
							</FormDescription>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='secondary'
											className={cn(
												'h-10 w-full justify-start border-none text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}>
											<CalendarIcon className='mr-2 size-4' />
											{field.value ? (
												format(field.value, 'PPP', { locale: es })
											) : (
												<span>Seleccione una fecha</span>
											)}
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										lang='es'
										locale={es}
										mode='single'
										selected={field.value}
										onSelect={field.onChange}
										disabled={date => date < new Date()}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='departure.time'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Hora de salida
								<FormTooltip>Selecciona la hora de salida.</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Selecciona la hora de salida.
							</FormDescription>
							<FormControl>
								<div className='relative w-full'>
									<Clock className='absolute left-3 top-3 size-4 text-muted-foreground' />
									<InputMask
										options={{
											time: true,
											timePattern: ['h', 'm'],
											timeFormat: '24',
										}}
										className='pl-10'
										placeholder='HH:MM'
										{...field}
									/>
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='intermediates'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Puntos de interés
								<FormTooltip>
									Añade direcciones o lugares de interés adicionales.
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Añade direcciones o lugares de interés adicionales.
							</FormDescription>
							<FormControl>
								<WaypointSetting
									title='Puntos de interés'
									description='Añade direcciones o lugares de interés adicionales.'
									onReady={waypoints => {
										field.onChange(waypoints)
									}}
									isMultipleSelection
									value={field.value}>
									<WaypointSettingTabs />
									{field.value && (
										<WaypointSettingList>
											{field.value.map(waypoint => (
												<WaypointSettingItem
													key={waypoint.placeId}
													waypoint={waypoint}
													onRemove={placeId =>
														field.onChange(
															field.value?.filter(
																waypoint => waypoint.placeId !== placeId
															)
														)
													}
												/>
											))}
										</WaypointSettingList>
									)}
								</WaypointSetting>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='travelMode'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Tipo de vehículo
								<FormTooltip>
									Indica si viajarás en automóvil o motocicleta.
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Indica si viajarás en automóvil o motocicleta.
							</FormDescription>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className='flex flex-col gap-3'>
									<FormItem className='flex items-center gap-1 space-y-0'>
										<FormControl>
											<RadioGroupItem value={TravelMode.DRIVE} />
										</FormControl>
										<FormLabel className='font-normal'>Automóvil</FormLabel>
									</FormItem>
									<FormItem className='flex items-center gap-1 space-y-0'>
										<FormControl>
											<RadioGroupItem value={TravelMode.TWO_WHEELER} />
										</FormControl>
										<FormLabel className='font-normal'>Motocicleta</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='routingPreference'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel className='flex items-center gap-1'>
								Consideraciones de tráfico
								<FormTooltip>
									Selecciona la condición de tráfico que más se ajuste a tus
									necesidades.
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Selecciona la condición de tráfico que más se ajuste a tus
								necesidades.
							</FormDescription>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className='flex flex-col gap-3'>
									<FormItem className='flex items-center gap-1 space-y-0'>
										<FormControl>
											<RadioGroupItem
												value={RoutingPreference.TRAFFIC_UNAWARE}
											/>
										</FormControl>
										<FormLabel className='font-normal'>
											No considerar el tráfico
										</FormLabel>
									</FormItem>

									<FormItem className='flex items-center gap-1 space-y-0'>
										<FormControl>
											<RadioGroupItem value={RoutingPreference.TRAFFIC_AWARE} />
										</FormControl>
										<FormLabel className='font-normal'>
											Considerar el tráfico
										</FormLabel>
									</FormItem>

									<FormItem className='flex items-center gap-1 space-y-0'>
										<FormControl>
											<RadioGroupItem
												value={RoutingPreference.TRAFFIC_AWARE_OPTIMAL}
											/>
										</FormControl>
										<FormLabel className='font-normal'>
											Considerar el tráfico y optimizar
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='routeModifiers'
					render={() => (
						<FormItem className='cols-span-full'>
							<FormLabel className='flex items-center gap-1'>
								Otras consideraciones
								<FormTooltip>Añade preferencias adicionales.</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Añade preferencias adicionales.
							</FormDescription>

							<section className='flex flex-col gap-3'>
								<FormField
									control={form.control}
									name='routeModifiers.avoidTolls'
									render={({ field }) => {
										return (
											<FormItem className='flex flex-row items-center space-x-3 space-y-0'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className='font-normal'>
													Evitar peajes
												</FormLabel>
											</FormItem>
										)
									}}
								/>

								<FormField
									control={form.control}
									name='routeModifiers.avoidHighways'
									render={({ field }) => {
										return (
											<FormItem className='flex flex-row items-center space-x-3 space-y-0'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className='font-normal'>
													Evitar autopistas
												</FormLabel>
											</FormItem>
										)
									}}
								/>

								<FormField
									control={form.control}
									name='routeModifiers.avoidFerries'
									render={({ field }) => {
										return (
											<FormItem className='flex flex-row items-center space-x-3 space-y-0'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className='font-normal'>
													Evitar transbordadores
												</FormLabel>
											</FormItem>
										)
									}}
								/>
							</section>

							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default BasicOptimizationForm

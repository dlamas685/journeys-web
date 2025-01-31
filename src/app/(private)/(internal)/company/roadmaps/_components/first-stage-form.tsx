'use client'

import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import FormTooltip from '@/common/components/ui/form/form-tooltip'
import InputMask from '@/common/components/ui/form/input-mask'
import Autocomplete from '@/common/components/ui/google/autocomplete'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { sleep } from '@/common/utils'
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
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Steps } from '../_enums'
import { firstStageFormSchema, FirstStageFormSchema } from '../_schemas'
import { useOptimization } from '../_store/optimization.store'

const FirstStageForm = () => {
	const form = useForm<FirstStageFormSchema>({
		resolver: zodResolver(firstStageFormSchema),
		defaultValues: {
			startWaypoint: undefined,
			endWaypoint: undefined,
			travelDurationMultiple: [1],
		},
	})

	const setLoading = useLoading(state => state.setLoading)

	const handleNext = useStepper(state => state.handleNext)

	const isDesktop = useMediaQuery('(min-width: 640px)')

	const presets = useOptimization(state => state.presets)

	const setPresets = useOptimization(state => state.setPresets)

	const handleSubmit = async (values: FirstStageFormSchema) => {
		setLoading(true)

		await sleep(1000)
			.then(() => {
				setPresets({
					firstStage: { ...values },
					secondStage: {
						services: presets?.secondStage.services ?? [],
					},
				})
				handleNext()
			})
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		if (presets)
			form.reset({
				startWaypoint: presets?.firstStage.startWaypoint,
				endWaypoint: presets?.firstStage.endWaypoint,
				global: {
					date: presets?.firstStage.global.date,
					startTime: presets?.firstStage.global.startTime,
					endTime: presets?.firstStage.global.endTime,
				},
				fixedCost: presets?.firstStage.fixedCost,
				costPerKilometer: presets?.firstStage.costPerKilometer,
				costPerHour: presets?.firstStage.costPerHour,
				costPerTraveledHour: presets?.firstStage.costPerTraveledHour,
				travelDurationMultiple: presets?.firstStage.travelDurationMultiple,
				routeModifiers: {
					avoidTolls: presets?.firstStage.routeModifiers?.avoidTolls,
					avoidHighways: presets?.firstStage.routeModifiers?.avoidHighways,
					avoidFerries: presets?.firstStage.routeModifiers?.avoidFerries,
				},
			})
	}, [form, presets])

	return (
		<Form {...form}>
			<form
				id={Steps.FIRST_STAGE.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='flex flex-col gap-4 sm:grid sm:grid-cols-4 sm:gap-5 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Primera Etapa
				</h2>

				<FormField
					control={form.control}
					name='startWaypoint'
					render={({ field, fieldState }) => (
						<FormItem className='col-span-2'>
							<FormLabel className='flex items-center gap-1'>
								Ubicación inicial
								<FormTooltip>
									Representa el lugar de donde parte el vehículo de la empresa
									(obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Representa el lugar de donde parte el vehículo de la empresa
								(obligatorio).
							</FormDescription>
							<FormControl>
								<Autocomplete
									value={field.value?.address ?? ''}
									placeholder='Ingresa la dirección inicial'
									searchPlaceholder=''
									onPlaceSelect={place => {
										if (!place) return

										const placeId = place.place_id

										const address = place.formatted_address

										const latitude = place.geometry?.location?.lat()

										const longitude = place.geometry?.location?.lng()

										field.onChange({
											placeId,
											address,
											location: { latitude, longitude },
										})
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='endWaypoint'
					render={({ field }) => (
						<FormItem className='col-span-2'>
							<FormLabel className='flex items-center gap-1'>
								Ubicación final
								<FormTooltip>
									Representa el lugar donde el vehículo de la empresa finaliza
									su recorrido (obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Representa el lugar donde el vehículo de la empresa finaliza su
								recorrido (obligatorio).
							</FormDescription>
							<FormControl>
								<Autocomplete
									value={field.value?.address ?? ''}
									placeholder='Ingresa la dirección final'
									searchPlaceholder=''
									onPlaceSelect={place => {
										if (!place) return

										const placeId = place.place_id

										const address = place.formatted_address

										const latitude = place.geometry?.location?.lat()

										const longitude = place.geometry?.location?.lng()

										field.onChange({
											placeId,
											address,
											location: { latitude, longitude },
										})
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='global.date'
					render={({ field }) => (
						<FormItem className='col-span-2'>
							<FormLabel className='flex items-center gap-1'>
								Fecha de inicio
								<FormTooltip>
									Representa la fecha en la que se realizara el recorrido
									(obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Representa la fecha en la que se realizara el recorrido
								(obligatorio).
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
												format(
													parse(field.value, 'yyyy-MM-dd', new Date()),
													'PPP',
													{ locale: es }
												)
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
										selected={
											field.value
												? parse(field.value, 'yyyy-MM-dd', new Date())
												: undefined
										}
										onSelect={e => {
											field.onChange(e ? format(e, 'yyyy-MM-dd') : e)
										}}
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
					name='global.startTime'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Hora de inicio
								<FormTooltip>
									Representa la hora en la que se empezara a operar
									(obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Representa la hora en la que se empezara a operar (obligatorio).
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
					name='global.endTime'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-1'>
								Hora de fin
								<FormTooltip>
									Representa la hora límite para completar todas las actividades
									y regresar a la ubicación final (obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Representa la hora límite para completar todas las actividades y
								regresar a la ubicación final (obligatorio).
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

				<Fieldset className='col-span-full'>
					<FieldsetLegend>Costos</FieldsetLegend>
					<FieldsetContent className='grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-5'>
						<FormField
							control={form.control}
							name='fixedCost'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'CF' : 'Costo fijo'}
										<FormTooltip>
											Representa un costo fijo asociado al uso del vehículo,
											independientemente de la distancia recorrida o el tiempo.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Representa un costo fijo asociado al uso del vehículo,
										independientemente de la distancia recorrida o el tiempo.
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 3,
												delimiter: '',
												numeralThousandsGroupStyle: 'thousand',
											}}
											placeholder='0.00'
											{...field}
											value={field.value}
											onChange={event => {
												const value = event.currentTarget.value
													? parseFloat(event.target.value)
													: undefined

												console.log(value)

												field.onChange(value)
											}}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='costPerKilometer'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'CPK' : 'Costo por kilómetro'}
										<FormTooltip>
											Representa el costo por cada kilómetro recorrido por el
											vehículo, útil para incluir costos de combustible o
											desgaste.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Representa el costo por cada kilómetro recorrido por el
										vehículo, útil para incluir costos de combustible o
										desgaste.
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 3,
												delimiter: '',
												numeralThousandsGroupStyle: 'thousand',
											}}
											placeholder='0.00'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='costPerHour'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'CPH' : 'Costo por hora'}
										<FormTooltip>
											Representa el costo por cada hora de uso del vehículo,
											incluyendo tiempo en tránsito y tareas realizadas.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Representa el costo por cada hora de uso del vehículo,
										incluyendo tiempo en tránsito y tareas realizadas.
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 3,
												delimiter: '',
												numeralThousandsGroupStyle: 'thousand',
											}}
											placeholder='0.00'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='costPerTraveledHour'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'CPHR' : 'Costo por hora recorrida'}
										<FormTooltip>
											Representa el costo asociado únicamente al tiempo que el
											vehículo pasa viajando entre ubicaciones
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Representa el costo asociado únicamente al tiempo que el
										vehículo pasa viajando entre ubicaciones
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 3,
												delimiter: '',
												numeralThousandsGroupStyle: 'thousand',
											}}
											placeholder='0.00'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='travelDurationMultiple'
							render={({ field }) => (
								<FormItem className='col-span-full'>
									<FormLabel className='flex items-center gap-1'>
										Multiplicador de tiempo de tránsito
										<FormTooltip>
											Penaliza o da más peso al tiempo de tránsito en la
											optimización. Valores mayores aumentan la importancia del
											tiempo de tránsito.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Penaliza o da más peso al tiempo de tránsito en la
										optimización. Valores mayores aumentan la importancia del
										tiempo de tránsito.
									</FormDescription>
									<FormControl>
										<div className='flex flex-col gap-2'>
											<Slider
												defaultValue={field.value}
												value={field.value}
												min={0.5}
												max={2}
												step={0.1}
												onValueChange={field.onChange}
											/>
											<span className='font-secondary text-sm text-muted-foreground'>
												Valor: {field.value?.at(0)}
											</span>
										</div>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<FormField
					control={form.control}
					name='routeModifiers'
					render={() => (
						<FormItem className='col-span-2'>
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
											<FormItem className='flex flex-row items-center space-x-2 space-y-0'>
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
											<FormItem className='flex flex-row items-center space-x-2 space-y-0'>
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
											<FormItem className='flex flex-row items-center space-x-2 space-y-0'>
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

export default FirstStageForm

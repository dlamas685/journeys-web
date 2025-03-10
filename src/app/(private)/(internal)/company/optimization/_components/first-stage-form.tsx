'use client'

import FormTooltip from '@/common/components/ui/form/form-tooltip'
import InputMask from '@/common/components/ui/form/input-mask'
import Autocomplete from '@/common/components/ui/google/autocomplete'
import { TIME } from '@/common/constants'
import { Pathnames } from '@/common/enums'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { convertToUTCISO, sleep } from '@/common/utils'
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DriverModel } from '../../drivers/_models'
import { FleetModel } from '../../fleets/_models'
import { VehicleModel } from '../../vehicles/_models'
import { findAvailableRoadmapAssets } from '../_actions/roadmaps.action'
import { Steps } from '../_enums'
import { firstStageFormSchema, FirstStageFormSchema } from '../_schemas'
import { useOptimization } from '../_store/optimization.store'

const FirstStageForm = () => {
	const form = useForm<FirstStageFormSchema>({
		resolver: zodResolver(firstStageFormSchema),
		defaultValues: {
			startWaypoint: undefined,
			endWaypoint: undefined,
		},
	})

	const [fleets, setFleets] = useState<FleetModel[]>([])

	const [vehicles, setVehicles] = useState<VehicleModel[]>([])

	const [drivers, setDrivers] = useState<DriverModel[]>([])

	const setLoading = useLoading(state => state.setLoading)

	const handleNext = useStepper(state => state.handleNext)

	const presets = useOptimization(state => state.presets)

	const setPresets = useOptimization(state => state.setPresets)

	const date = form.watch('global.date')

	const startTime = form.watch('global.startTime')

	const endTime = form.watch('global.endTime')

	const isDateNotCompleted =
		date === undefined || !TIME.test(startTime) || !TIME.test(endTime)

	const isFleetNotSelected = form.watch('fleetId') === undefined

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
		const fetchFleets = async () => {
			const fromDate = convertToUTCISO(date, startTime)
			const toDate = convertToUTCISO(date, endTime)

			const response = await findAvailableRoadmapAssets(
				fromDate,
				toDate,
				Pathnames.ROADMAPS
			)

			setFleets(response)
		}

		if (isDateNotCompleted) {
			setFleets([])
			setVehicles([])
			setDrivers([])
			form.setValue('fleetId', '')
			form.setValue('vehicleId', '')
			form.setValue('driverId', '')
			return
		}

		fetchFleets()
	}, [date, startTime, endTime, isDateNotCompleted, form])

	useEffect(() => {
		if (presets) {
			form.reset({
				startWaypoint: presets.firstStage.startWaypoint,
				endWaypoint: presets.firstStage.endWaypoint,
				global: {
					date: presets.firstStage.global.date,
					startTime: presets.firstStage.global.startTime,
					endTime: presets.firstStage.global.endTime,
				},
				modifiers: presets.firstStage.modifiers,
				fleetId: presets.firstStage.fleetId,
				vehicleId: presets.firstStage.vehicleId,
				driverId: presets.firstStage.driverId,
			})
		}
	}, [form, presets])

	return (
		<Form {...form}>
			<form
				id={Steps.FIRST_STAGE.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='flex flex-col gap-4 sm:grid sm:grid-cols-4 sm:gap-6 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Primera Etapa
				</h2>

				<FormField
					control={form.control}
					name='startWaypoint'
					render={({ field }) => (
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
									searchType={['address']}
									searchPlaceholder='Escribe la dirección'
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
									searchPlaceholder='Escribe la dirección'
									searchType={['address']}
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
										onSelect={value => {
											if (!value) {
												form.setValue('fleetId', '')
												form.setValue('vehicleId', '')
												form.setValue('driverId', '')
											}

											field.onChange(
												value ? format(value, 'yyyy-MM-dd') : value
											)
										}}
										// disabled={date => date < new Date()}
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
										onChange={event => {
											const value = event.currentTarget.value
												? event.currentTarget.value
												: undefined

											field.onChange(value)
										}}
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
										onChange={event => {
											const value = event.currentTarget.value
												? event.currentTarget.value
												: undefined

											field.onChange(value)
										}}
									/>
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='fleetId'
					render={({ field }) => (
						<FormItem className='col-span-2'>
							<FormLabel className='flex items-center gap-1'>
								Flota
								<FormTooltip>
									Indica la flota que se utilizara para el recorrido
									(obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Indica la flota que se utilizara para el recorrido
								(obligatorio).
							</FormDescription>

							<Select
								onValueChange={event => {
									setVehicles(
										fleets.find(fleet => fleet.id === event)?.vehicles ?? []
									)

									setDrivers(
										fleets.find(fleet => fleet.id === event)?.drivers ?? []
									)
									form.setValue('vehicleId', '')
									form.setValue('driverId', '')
									field.onChange(event)
								}}
								defaultValue={field.value}
								value={field.value}
								disabled={fleets.length === 0}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Seleccione una flota' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{fleets.map(fleet => (
											<SelectItem key={fleet.id} value={fleet.id}>
												{fleet.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='vehicleId'
					render={({ field }) => (
						<FormItem className='col-span-2'>
							<FormLabel className='flex items-center gap-1'>
								Vehículo
								<FormTooltip>
									Indica el vehículo que se utilizara para el recorrido
									(obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Indica el vehículo que se utilizara para el recorrido
								(obligatorio).
							</FormDescription>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								value={field.value}
								disabled={vehicles.length === 0}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Seleccione un vehículo' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{vehicles.map(vehicle => (
											<SelectItem key={vehicle.id} value={vehicle.id}>
												{vehicle.licensePlate}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='driverId'
					render={({ field }) => (
						<FormItem className='col-span-2'>
							<FormLabel className='flex items-center gap-1'>
								Conductor
								<FormTooltip>
									Indica el vehículo que se utilizara para el recorrido
									(obligatorio).
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Indica el vehículo que se utilizara para el recorrido
								(obligatorio).
							</FormDescription>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								value={field.value}
								disabled={drivers.length === 0}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Seleccione un conductor' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{drivers.map(driver => (
											<SelectItem key={driver.id} value={driver.id}>
												{driver.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='modifiers'
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
									name='modifiers.avoidTolls'
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
									name='modifiers.avoidHighways'
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
									name='modifiers.avoidFerries'
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

								<FormField
									control={form.control}
									name='modifiers.considerRoadTraffic'
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
													Considerar tráfico
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

				{/* <pre>{JSON.stringify(form.getValues(), null, 3)}</pre> */}
			</form>
		</Form>
	)
}

export default FirstStageForm

'use client'

import { ApiError } from '@/common/classes/api-error.class'
import InputMask from '@/common/components/ui/form/input-mask'
import { REPLICATE_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { convertToUTCISO } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { replicate } from '../_actions/trips.action'
import { ReplicateTripModel, TripModel } from '../_models'
import { replicationFormSchema, ReplicationFormSchema } from '../_schemas'

type Props = {
	record: TripModel
}

const ReplicationForm = ({ record }: Readonly<Props>) => {
	const form = useForm<ReplicationFormSchema>({
		defaultValues: {
			id: record.id,
			alias: '',
			departureConfig: 'current',
			departure: undefined,
		},
		resolver: zodResolver(replicationFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({
		id,
		alias,
		departure,
		departureConfig,
	}: ReplicationFormSchema) => {
		setLoading(true)

		const replicateModel: ReplicateTripModel = {
			id,
			code: alias,
			departureTime:
				departure && departureConfig === 'schedule'
					? convertToUTCISO(departure.date, departure.time)
					: undefined,
		}

		await replicate(replicateModel)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Viajes',
					description: 'El viaje ha sido replicado correctamente.',
				})

				form.reset()

				setOpen(false)
			})
			.catch(response.error)
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<Form {...form}>
			<form
				id={REPLICATE_FORM_ID}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:grid-cols-2 sm:px-1'>
				<FormField
					control={form.control}
					name='alias'
					render={({ field }) => (
						<FormItem className='col-span-full'>
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

				<FormField
					control={form.control}
					name='departureConfig'
					render={({ field }) => (
						<FormItem className='col-span-full mb-2'>
							<FormLabel>Configuración de salida</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={value => {
										field.onChange(value)

										if (value === 'current') {
											form.setValue('departure', undefined)
										}
									}}
									defaultValue={field.value}
									className='flex flex-col'>
									<FormItem className='flex items-center gap-2 space-y-0'>
										<FormControl>
											<RadioGroupItem value='current' />
										</FormControl>
										<FormLabel className='font-normal'>Salir ahora</FormLabel>
									</FormItem>
									<FormItem className='flex items-center gap-2 space-y-0'>
										<FormControl>
											<RadioGroupItem value='schedule' />
										</FormControl>
										<FormLabel className='font-normal'>
											Programar salida
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{form.watch('departureConfig') === 'schedule' && (
					<>
						<FormField
							control={form.control}
							name='departure.date'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										Fecha de salida
									</FormLabel>
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
							name='departure.time'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										Hora de salida
									</FormLabel>
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
					</>
				)}
			</form>
		</Form>
	)
}

export default ReplicationForm

import { ApiError } from '@/common/classes/api-error.class'
import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import FormTooltip from '@/common/components/ui/form/form-tooltip'
import InputMask from '@/common/components/ui/form/input-mask'
import Autocomplete from '@/common/components/ui/google/autocomplete'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { secondsToHHMM, sleep } from '@/common/utils'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { Steps } from '../_enums'
import { secondStageFormSchema, SecondStageFormSchema } from '../_schemas'
import { useOptimization } from '../_store/optimization.store'
import ServicesSetting from './services-setting'

const SecondStageForm = () => {
	const response = useResponse()

	const setLoading = useLoading(state => state.setLoading)

	const presets = useOptimization(state => state.presets)

	const setPresets = useOptimization(state => state.setPresets)

	const handleNext = useStepper(state => state.handleNext)

	const form = useForm<SecondStageFormSchema>({
		resolver: zodResolver(secondStageFormSchema),
		defaultValues: {
			services: presets?.secondStage.services ?? [],
		},
	})

	const handleSubmit = async (values: SecondStageFormSchema) => {
		setLoading(true)

		await sleep(1000)
			.then(() => {
				if (!presets) {
					throw new ApiError({
						error: 'Not Found',
						message: 'No se encontraron los datos de la primera etapa',
						statusCode: 404,
					})
				}

				setPresets({
					...presets,
					secondStage: {
						...values,
					},
				})
				handleNext()
			})
			.catch(response.error)
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<Form {...form}>
			<form
				id={Steps.SECOND_STAGE.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Segunda Etapa
				</h2>

				<FormField
					control={form.control}
					name='services'
					render={({ field, formState }) => (
						<FormItem className='col-span-full'>
							<FormLabel className='flex items-center gap-1'>
								Servicios a domicilio
								<FormTooltip>
									Indica las actividades con sus ubicaciones, duraciones y los
									horarios de disponibilidad del lugar.
								</FormTooltip>
							</FormLabel>
							<FormDescription className='sm:hidden'>
								Indica los servicios con sus ubicaciones, duraciones y los
								horarios de disponibilidad del cliente.
							</FormDescription>
							<FormControl>
								<section className='space-y-4'>
									<ServicesSetting
										onReady={selected => {
											field.onChange([
												...field.value,
												...selected.map(activity => ({
													...activity,
													id: uuid(),
													duration: activity.duration
														? secondsToHHMM(activity.duration)
														: undefined,
												})),
											])
										}}
									/>
									{field.value && field.value.length > 0 && (
										<section className='flex flex-col gap-3'>
											{field.value.map((service, index) => (
												<Fieldset
													key={service.id}
													className='border-2 border-dashed p-3'>
													<FieldsetLegend className='flex items-center justify-between py-0'>
														Servicio #{index + 1}
														<Trash2
															className='size-4 cursor-pointer text-red-500'
															onClick={() => {
																const updatedServices = form
																	.watch('services')
																	.filter((_, i) => i !== index)

																form.reset({
																	...form.getValues(),
																	services: updatedServices,
																})

																form.trigger('services')
															}}
														/>
													</FieldsetLegend>
													<FieldsetContent className='grid grid-cols-[1.7fr_0.3fr] gap-2'>
														<p className='col-span-full font-secondary text-sm text-muted-foreground'>
															<b className='text-sm font-medium text-foreground'>
																Actividad:
															</b>{' '}
															{service.name}
														</p>
														<p className='col-span-full font-secondary text-sm text-muted-foreground'>
															<b className='text-sm font-medium text-foreground'>
																Descripción:
															</b>{' '}
															{service.description}
														</p>

														<FormField
															control={form.control}
															name={`services.${index}.waypoint`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Dirección</FormLabel>
																	<FormControl>
																		<Autocomplete
																			value={field.value?.address ?? ''}
																			placeholder='Ingresa una dirección'
																			searchPlaceholder=''
																			onPlaceSelect={place => {
																				if (!place) return

																				const placeId = place.place_id

																				const address = place.formatted_address

																				const latitude =
																					place.geometry?.location?.lat()

																				const longitude =
																					place.geometry?.location?.lng()

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
															name={`services.${index}.duration`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Duración</FormLabel>
																	<FormControl>
																		<InputMask
																			options={{
																				time: true,
																				timePattern: ['h', 'm'],
																				timeFormat: '24',
																			}}
																			placeholder='HH:MM'
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</FieldsetContent>
												</Fieldset>
											))}
										</section>
									)}
								</section>
							</FormControl>

							{formState.errors?.services?.root?.message ? (
								<p className='text-[0.8rem] font-medium text-destructive'>
									{formState.errors?.services?.root?.message}
								</p>
							) : (
								<FormMessage />
							)}
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default SecondStageForm

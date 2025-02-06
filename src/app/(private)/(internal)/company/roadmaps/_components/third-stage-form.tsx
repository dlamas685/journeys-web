'use client'

import { ApiError } from '@/common/classes/api-error.class'
import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import FormTooltip from '@/common/components/ui/form/form-tooltip'
import InputMask from '@/common/components/ui/form/input-mask'
import { useDependenciesContext } from '@/common/hooks/use-dependencies-context'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import { sleep } from '@/common/utils'
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CostProfile, Steps } from '../_enums'
import { CostProfileModel } from '../_models'
import { thirdStageFormSchema, ThirdStageFormSchema } from '../_schemas'
import { useOptimization } from '../_store/optimization.store'

const ThirdStageForm = () => {
	const isDesktop = useMediaQuery('(min-width: 640px)')

	const response = useResponse()

	const handleNext = useStepper(state => state.handleNext)

	const presets = useOptimization(state => state.presets)

	const setPresets = useOptimization(state => state.setPresets)

	const setLoading = useLoading(state => state.setLoading)

	const { dependencies } = useDependenciesContext()

	const costProfiles = dependencies.costProfiles as CostProfileModel[]

	const form = useForm<ThirdStageFormSchema>({
		resolver: zodResolver(thirdStageFormSchema),
		defaultValues: {
			costProfile:
				presets?.thirdStage?.costProfile ?? CostProfile.optimized_balance,
			costModel: presets?.thirdStage?.costModel ?? {
				travelDurationMultiple: [1],
			},
			bounds: presets?.thirdStage?.bounds,
		},
	})

	const handleSubmit = async (values: ThirdStageFormSchema) => {
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
					thirdStage: {
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
				id={Steps.THIRD_STAGE.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Tercera Etapa
				</h2>

				<FormField
					control={form.control}
					name='costProfile'
					render={({ field }) => {
						const costProfile = costProfiles.find(
							costProfile => costProfile.id === field.value
						)

						return (
							<FormItem className='col-span-full flex flex-col gap-3 space-y-0'>
								<FormLabel>Perfil de costos</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Selecciona un perfil de costo' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{costProfiles.map(costProfile => (
											<SelectItem key={costProfile.id} value={costProfile.id}>
												{costProfile.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<p className='font-secondary text-sm text-muted-foreground'>
									Los valores de los costos representan unidades relativas.
								</p>
								{field.value !== CostProfile.optimized_custom &&
									costProfile && (
										<dl className='grid grid-cols-2 font-secondary text-sm text-muted-foreground'>
											<dt>Nombre:</dt>
											<dd>{costProfile.name}</dd>

											<dt>Descripción:</dt>
											<dd>{costProfile.description}</dd>

											<dt>Costo fijo (CF):</dt>
											<dd>{costProfile.fixedCost}</dd>

											<dt>Costo por kilómetro (CPK):</dt>
											<dd>{costProfile.costPerKilometer}</dd>

											<dt>Costo por hora (CPH):</dt>
											<dd>{costProfile.costPerHour}</dd>

											<dt>Costo por hora recorrida (CPHR):</dt>
											<dd>{costProfile.costPerTraveledHour}</dd>

											<dt>Multiplicador de tiempo de tránsito:</dt>
											<dd>{costProfile.travelDurationMultiple}</dd>
										</dl>
									)}

								{field.value === CostProfile.optimized_custom && (
									<section className='grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-5'>
										<FormField
											control={form.control}
											name='costModel.fixedCost'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='flex items-center gap-1'>
														{isDesktop ? 'CF' : 'Costo fijo'}
														<FormTooltip>
															Representa un costo fijo asociado al uso del
															vehículo, independientemente de la distancia
															recorrida o el tiempo.
														</FormTooltip>
													</FormLabel>
													<FormDescription className='sm:hidden'>
														Representa un costo fijo asociado al uso del
														vehículo, independientemente de la distancia
														recorrida o el tiempo.
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
											name='costModel.costPerKilometer'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='flex items-center gap-1'>
														{isDesktop ? 'CPK' : 'Costo por kilómetro'}
														<FormTooltip>
															Representa el costo por cada kilómetro recorrido
															por el vehículo, útil para incluir costos de
															combustible o desgaste.
														</FormTooltip>
													</FormLabel>
													<FormDescription className='sm:hidden'>
														Representa el costo por cada kilómetro recorrido por
														el vehículo, útil para incluir costos de combustible
														o desgaste.
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
											name='costModel.costPerHour'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='flex items-center gap-1'>
														{isDesktop ? 'CPH' : 'Costo por hora'}
														<FormTooltip>
															Representa el costo por cada hora de uso del
															vehículo, incluyendo tiempo en tránsito y tareas
															realizadas.
														</FormTooltip>
													</FormLabel>
													<FormDescription className='sm:hidden'>
														Representa el costo por cada hora de uso del
														vehículo, incluyendo tiempo en tránsito y tareas
														realizadas.
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
											name='costModel.costPerTraveledHour'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='flex items-center gap-1'>
														{isDesktop ? 'CPHR' : 'Costo por hora recorrida'}
														<FormTooltip>
															Representa el costo asociado únicamente al tiempo
															que el vehículo pasa viajando entre ubicaciones
														</FormTooltip>
													</FormLabel>
													<FormDescription className='sm:hidden'>
														Representa el costo asociado únicamente al tiempo
														que el vehículo pasa viajando entre ubicaciones
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
											name='costModel.travelDurationMultiple'
											render={({ field }) => (
												<FormItem className='col-span-full'>
													<FormLabel className='flex items-center gap-1'>
														Multiplicador de tiempo de tránsito
														<FormTooltip>
															Penaliza o da más peso al tiempo de tránsito en la
															optimización. Valores mayores aumentan la
															importancia del tiempo de tránsito.
														</FormTooltip>
													</FormLabel>
													<FormDescription className='sm:hidden'>
														Penaliza o da más peso al tiempo de tránsito en la
														optimización. Valores mayores aumentan la
														importancia del tiempo de tránsito.
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
									</section>
								)}
								<FormMessage />
							</FormItem>
						)
					}}
				/>

				<Fieldset>
					<FieldsetLegend className='py-0'>Límites</FieldsetLegend>
					<FieldsetContent className='grid grid-cols-3'>
						<FormField
							control={form.control}
							name='bounds.routeDurationLimit'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										Duración total
										<FormTooltip>
											Indica el límite que define la duración máxima permitida.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica el límite que define la duración máxima permitida.
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												time: true,
												timePattern: ['h', 'm'],
												timeFormat: '24',
											}}
											placeholder='HH:MM'
											{...field}
											onChange={event => {
												const value = event.currentTarget.value
													? event.currentTarget.value
													: undefined

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
							name='bounds.travelDurationLimit'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										Duración en transito
										<FormTooltip>
											Indica el límite que define la duración máxima permitida
											en transito.
										</FormTooltip>
									</FormLabel>
									<FormControl>
										<InputMask
											options={{
												time: true,
												timePattern: ['h', 'm'],
												timeFormat: '24',
											}}
											placeholder='HH:MM'
											{...field}
											onChange={event => {
												const value = event.currentTarget.value
													? event.currentTarget.value
													: undefined

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
							name='bounds.routeDistanceLimit'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										Distancia total
										<FormTooltip>
											Indica el límite que define la distancia máxima permitida.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica el límite que define la distancia máxima permitida.
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 7,
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

												field.onChange(value)
											}}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				{/* <pre>{JSON.stringify(form.getValues(), null, 3)}</pre> */}
			</form>
		</Form>
	)
}

export default ThirdStageForm

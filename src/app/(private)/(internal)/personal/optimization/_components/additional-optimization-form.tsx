'use client'

import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import FormTooltip from '@/common/components/ui/form/form-tooltip'
import InputMask from '@/common/components/ui/form/input-mask'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import 'cleave.js/dist/addons/cleave-phone.ar'
import { useForm } from 'react-hook-form'
import { Steps } from '../_enums'
import {
	additionalOptimizationFormSchema,
	AdditionalOptimizationFormSchema,
} from '../_schemas'
import { useOptimization } from '../_store/optimization.store'

const AdditionalOptimizationForm = () => {
	const form = useForm<AdditionalOptimizationFormSchema>({
		resolver: zodResolver(additionalOptimizationFormSchema),
		defaultValues: {},
	})

	const isDesktop = useMediaQuery('(min-width: 640px)')

	const setLoading = useLoading(state => state.setLoading)

	const setPresets = useOptimization(state => state.setPresets)

	const handleNext = useStepper(state => state.handleNext)

	const handleSubmit = async ({}: any) => {
		handleNext()
	}

	return (
		<Form {...form}>
			<form
				id={Steps.ADDITIONAL.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-5 sm:px-2'>
				<section className='col-span-full'>
					<h2 className='text-base font-medium text-foreground sm:text-lg'>
						Criterios Adicionales
					</h2>
					<p className='text-sm text-muted-foreground'>
						Genera ganancias creando una publicación de entregas al llegar a tu
						destino. Además, puedes agregar criterios adicionales para optimizar
						la ruta y mejorar la eficiencia.
					</p>
				</section>
				<Fieldset className='gap-4'>
					<FieldsetLegend className='py-0'>Transportista</FieldsetLegend>
					<FieldsetContent className='grid-cols-2 gap-4'>
						<FormField
							name='carrierName'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										Nombre
										<FormTooltip>
											Ingresa el nombre de la persona que se encargara de
											realizar las entregas (campo obligatorio).
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Ingresa el nombre de la persona que se encargara de realizar
										las entregas (campo obligatorio).
									</FormDescription>
									<FormControl>
										<Input placeholder='Ingrese el nombre' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='carrierPhone'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										Teléfono
										<FormTooltip>
											Ingresa el número de teléfono de la persona que se
											encargara de las entregas (campo obligatorio).
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Ingresa el número de teléfono de la persona que se encargara
										de las entregas (campo obligatorio).
									</FormDescription>
									<FormControl>
										<InputMask
											{...field}
											type='text'
											placeholder='Ingresa el teléfono sin +54'
											options={{
												phone: true,
												phoneRegionCode: 'AR',
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='gap-4'>
					<FieldsetLegend className='py-0'>
						Capacidad y tarifas del servicio
					</FieldsetLegend>
					<FieldsetContent className='grid-cols-3 gap-4'>
						<FormField
							control={form.control}
							name='pricePerKg'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'PPK' : 'Precio por kilogramo'}
										<FormTooltip>
											Indica el precio por kilogramo que se cobrará por el
											servicio de transporte de la carga (campo obligatorio).
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica el precio por kilogramo que se cobrará por el
										servicio de transporte de la carga (campo obligatorio).
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 4,
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
							name='pricePerPostal'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'PPP' : 'Precio por postal'}
										<FormTooltip>
											Indica el precio que se cobrará por el servicio de envío
											de una postal (campo obligatorio).
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica el precio que se cobrará por el servicio de envío de
										una postal (campo obligatorio).
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 4,
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
							name='maxCapacityKg'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'CMK' : 'Capacidad máxima en kilogramos'}
										<FormTooltip>
											Indica la capacidad máxima en kilogramos que se puede
											llevar en el viaje (campo obligatorio).
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica la capacidad máxima en kilogramos que se puede llevar
										en el viaje (campo obligatorio).
									</FormDescription>
									<FormControl>
										<InputMask
											options={{
												numeral: true,
												numeralDecimalScale: 2,
												numeralDecimalMark: '.',
												numeralPositiveOnly: true,
												numeralIntegerScale: 5,
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
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='gap-4'>
					<FieldsetLegend className='py-0'>Costos operativos</FieldsetLegend>
					<FieldsetContent className='grid-cols-4'>
						<FormField
							control={form.control}
							name='fixedCost'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-1'>
										{isDesktop ? 'CF' : 'Costo fijo'}
										<FormTooltip>
											Indica el costo fijo asociado al uso del vehículo,
											independientemente de la distancia recorrida o el tiempo.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica un costo fijo asociado al uso del vehículo,
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
											Indica el costo por cada kilómetro recorrido por el
											vehículo, útil para incluir costos de combustible o
											desgaste.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica el costo por cada kilómetro recorrido por el
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
											Indica el costo por cada hora de uso del vehículo,
											incluyendo tiempo en tránsito y entregas realizadas.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica el costo por cada hora de uso del vehículo,
										incluyendo tiempo en tránsito y entregas realizadas.
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
											Indica el costo asociado únicamente al tiempo que el
											vehículo pasa viajando entre receptores.
										</FormTooltip>
									</FormLabel>
									<FormDescription className='sm:hidden'>
										Indica el costo asociado únicamente al tiempo que el
										vehículo pasa viajando entre receptores.
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
					</FieldsetContent>
				</Fieldset>

				{/* <Fieldset>
					<FieldsetLegend>Consideraciones adicionales</FieldsetLegend>
					<FieldsetContent className='flex justify-between'>
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
										<FormLabel className='font-normal'>Evitar peajes</FormLabel>
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
					</FieldsetContent>
				</Fieldset> */}
			</form>
		</Form>
	)
}

export default AdditionalOptimizationForm

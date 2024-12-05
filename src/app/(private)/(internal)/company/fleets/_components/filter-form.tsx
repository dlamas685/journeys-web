'use client'

import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import {
	DATE_FILTER_OPTIONS,
	FILTER_FORM_ID,
	NUMBER_FILTER_OPTIONS,
	TEXT_FILTER_OPTIONS,
} from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { FilterTypes } from '@/common/enums'
import { FilterFieldModel, QueryParamsModel } from '@/common/models'
import { fromQueryToFilterForm, jsonToBase64 } from '@/common/utils'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Eraser } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { DEFAULT_VALUES } from '../_constants'
import { filterFormSchema, FilterFormSchema } from '../_schemas'

type Props = {
	queryParams: QueryParamsModel
}

const FilterForm = ({ queryParams }: Readonly<Props>) => {
	const form = useForm<FilterFormSchema>({
		defaultValues: {
			...DEFAULT_VALUES,
			...fromQueryToFilterForm<FilterFormSchema>(queryParams.filters),
		},
		resolver: zodResolver(filterFormSchema),
	})

	const pathname = usePathname()

	const router = useRouter()

	const { setOpen } = useContext(DialogContext)

	const handleSubmit = async (values: FilterFormSchema) => {
		const filters = Object.values(values)
			.filter(filter => filter.rule && filter.value)
			.map(
				filter =>
					({
						field: filter.field,
						rule: filter.rule,
						value: filter.value,
						type: filter.type,
					}) as FilterFieldModel
			)

		const newQueryParams: QueryParamsModel = {
			...queryParams,
			filters,
		}

		const query = jsonToBase64(newQueryParams)

		router.replace(`${pathname}?query=${query}`)

		setOpen(false)
	}

	return (
		<Form key={JSON.stringify(form.getValues())} {...form}>
			<form
				className='flex max-h-96 flex-col gap-2 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:gap-3 sm:px-1'
				id={FILTER_FORM_ID}
				autoComplete='off'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Nombre
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									name: {
										field: 'name',
										type: FilterTypes.STRING,
										rule: undefined,
										value: undefined,
									},
								})
							}}>
							<Eraser className='size-4' />
						</Button>
					</FieldsetLegend>
					<FieldsetContent className='grid-cols-1 sm:grid-cols-2'>
						<FormField
							control={form.control}
							name='name.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Selección una regla' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TEXT_FILTER_OPTIONS.map(option => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='name.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<Input placeholder='Ingrese un valor' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Descripción
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									description: {
										field: 'description',
										type: FilterTypes.STRING,
										rule: undefined,
										value: undefined,
									},
								})
							}}>
							<Eraser className='size-4' />
						</Button>
					</FieldsetLegend>
					<FieldsetContent className='grid-cols-1 sm:grid-cols-2'>
						<FormField
							control={form.control}
							name='description.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Selección una regla' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TEXT_FILTER_OPTIONS.map(option => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<Input placeholder='Ingrese un valor' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Cantidad de vehículos
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									maxVehicles: {
										field: 'maxVehicles',
										type: FilterTypes.NUMBER,
										rule: undefined,
										value: undefined,
									},
								})
							}}>
							<Eraser className='size-4' />
						</Button>
					</FieldsetLegend>
					<FieldsetContent className='grid-cols-1 sm:grid-cols-2'>
						<FormField
							control={form.control}
							name='maxVehicles.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Selección una regla' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{NUMBER_FILTER_OPTIONS.map(option => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='maxVehicles.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Ingrese un valor'
											{...field}
											onChange={e => {
												const value = e.target.value
													? parseInt(e.target.value)
													: undefined
												field.onChange(value)
											}}
											value={field.value?.toString() || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Cantidad de conductores
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									maxDrivers: {
										field: 'maxDrivers',
										type: FilterTypes.NUMBER,
										rule: undefined,
										value: undefined,
									},
								})
							}}>
							<Eraser className='size-4' />
						</Button>
					</FieldsetLegend>
					<FieldsetContent className='grid-cols-1 sm:grid-cols-2'>
						<FormField
							control={form.control}
							name='maxDrivers.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Selección una regla' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{NUMBER_FILTER_OPTIONS.map(option => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='maxDrivers.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Ingrese un valor'
											{...field}
											onChange={e => {
												const value = e.target.value
													? parseInt(e.target.value)
													: undefined
												field.onChange(value)
											}}
											value={field.value?.toString() || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Creado
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									createdAt: {
										field: 'createdAt',
										type: FilterTypes.DATE,
										rule: undefined,
										value: undefined,
									},
								})
							}}>
							<Eraser className='size-4' />
						</Button>
					</FieldsetLegend>
					<FieldsetContent className='grid-cols-1 sm:grid-cols-2'>
						<FormField
							control={form.control}
							name='createdAt.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Selección una regla' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{DATE_FILTER_OPTIONS.map(option => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='createdAt.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
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
												disabled={date => date > new Date()}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>
			</form>
		</Form>
	)
}

export default FilterForm

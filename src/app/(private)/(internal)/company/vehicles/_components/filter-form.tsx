'use client'

import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import InputMask from '@/common/components/ui/form/input-mask'
import {
	DATE_FILTER_OPTIONS,
	FILTER_FORM_ID,
	NUMBER_FILTER_OPTIONS,
	RELATION_FILTER_OPTION,
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
import { FleetModel } from '../../fleets/_models'
import { DEFAULT_VALUES } from '../_constants'
import { filterFormSchema, FilterFormSchema } from '../_schemas'

type Props = {
	queryParams: QueryParamsModel
	fleets: FleetModel[]
}

const FilterForm = ({ queryParams, fleets }: Readonly<Props>) => {
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
				className='flex max-h-96 flex-col gap-2 overflow-y-auto px-4 pb-2 sm:max-h-[600px] sm:gap-3 sm:px-1'
				id={FILTER_FORM_ID}
				autoComplete='off'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Patente
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									licensePlate: {
										field: 'licensePlate',
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
							name='licensePlate.rule'
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
							name='licensePlate.value'
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
						Marca
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									make: {
										field: 'make',
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
							name='make.rule'
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
							name='make.value'
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
						Modelo
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									model: {
										field: 'model',
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
							name='model.rule'
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
							name='model.value'
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
						Año
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									year: {
										field: 'year',
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
							name='year.rule'
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
							name='year.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<InputMask
											placeholder='Ingrese un valor'
											{...field}
											options={{
												numericOnly: true,
												blocks: [4],
											}}
											onChange={e => {
												const value = e.target.value
													? parseInt(e.target.value)
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

				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Flota
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									fleetId: {
										field: 'fleetId',
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
							name='fleetId.rule'
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
											{RELATION_FILTER_OPTION.map(option => (
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
							name='fleetId.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Seleccione una flota' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{fleets.map(fleet => (
												<SelectItem key={fleet.id} value={fleet.id}>
													{fleet.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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

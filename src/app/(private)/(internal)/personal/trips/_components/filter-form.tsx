'use client'

import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import {
	BOOLEAN_FILTER_OPTIONS,
	DATE_FILTER_OPTIONS,
	FILTER_FORM_ID,
	TEXT_FILTER_OPTIONS,
} from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { FilterTypes } from '@/common/enums'
import type { FilterFieldModel, QueryParamsModel } from '@/common/models'
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
import { filterFormSchema, type FilterFormSchema } from '../_schemas'

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
			.filter(
				filter =>
					filter.rule && filter.value !== undefined && filter.value !== null
			)
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
				className='flex max-h-96 flex-col gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:px-1'
				id={FILTER_FORM_ID}
				autoComplete='off'
				onSubmit={form.handleSubmit(handleSubmit)}>
				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='FilterFieldSetLegend'>
						Alias
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									alias: {
										field: 'code',
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
							name='alias.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger
												className={cn({
													SelectPlaceHolder: !field.value,
												})}>
												<SelectValue placeholder='Seleccione una regla' />
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
							name='alias.value'
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
					<FieldsetLegend className='FilterFieldSetLegend'>
						Fecha de salida
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									departureTime: {
										field: 'departureTime',
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
							name='departureTime.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger
												className={cn({
													SelectPlaceHolder: !field.value,
												})}>
												<SelectValue placeholder='Seleccione una regla' />
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
							name='departureTime.value'
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

				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='FilterFieldSetLegend'>
						Condición
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									isArchived: {
										field: 'isArchived',
										type: FilterTypes.BOOLEAN,
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
							name='isArchived.rule'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Regla</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger
												className={cn({
													SelectPlaceHolder: !field.value,
												})}>
												<SelectValue placeholder='Seleccione una regla' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{BOOLEAN_FILTER_OPTIONS.map(option => (
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
							name='isArchived.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<Select
											onValueChange={(value: string) => {
												field.onChange(value === 'true')
											}}
											defaultValue={field.value?.toString()}>
											<FormControl>
												<SelectTrigger
													className={cn({
														SelectPlaceHolder:
															field.value === undefined || field.value === null,
													})}>
													<SelectValue placeholder='Seleccione una condición' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='false'>Listo para usar</SelectItem>
												<SelectItem value='true'>Usado</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldsetContent>
				</Fieldset>

				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='FilterFieldSetLegend'>
						Fecha de creación
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
											<SelectTrigger
												className={cn({
													SelectPlaceHolder: !field.value,
												})}>
												<SelectValue placeholder='Seleccione una regla' />
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

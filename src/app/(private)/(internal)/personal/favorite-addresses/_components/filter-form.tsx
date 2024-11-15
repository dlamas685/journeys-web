'use client'
import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import { FILTER_FORM_ID, TEXT_FILTER_OPTIONS } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { FilterFieldModel, QueryParamsModel } from '@/common/models'
import { fromQueryToFilterForm, jsonToBase64 } from '@/common/utils'
import { Button } from '@/components/ui/button'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eraser } from 'lucide-react'
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
				onSubmit={form.handleSubmit(handleSubmit)}>
				<Fieldset className='gap-0.5'>
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
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
										field: 'alias',
										type: 'string',
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
					<FieldsetLegend className='flex items-center justify-between py-0 text-base font-bold'>
						Dirección
						<Button
							className='text-orange-700 hover:text-orange-700/90'
							size='icon'
							variant='ghost'
							type='button'
							onClick={() => {
								form.reset({
									...form.getValues(),
									address: {
										field: 'address',
										type: 'string',
										rule: undefined,
										value: undefined,
									},
								})
							}}>
							<Eraser className='size-4' />
						</Button>
					</FieldsetLegend>
					<FieldsetContent className='grid-cols-1 sm:grid-cols-1'>
						<FormField
							control={form.control}
							name='address.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormDescription>
										Este campo de entrada permite buscar direcciones mediante la
										API de Google Autocomplete.
									</FormDescription>
									<FormControl>
										<Input
											placeholder='Ingrese una dirección'
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
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

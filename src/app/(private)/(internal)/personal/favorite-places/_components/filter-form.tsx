'use client'
import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import { FILTER_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { FilterRules } from '@/common/enums'
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
										type: 'string',
										rule: FilterRules.CONTAINS,
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
							name='name.value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormDescription>
										Este campo de entrada permite buscar lugares mediante la API
										de Google Text Search.
									</FormDescription>
									<FormControl>
										<Input
											placeholder='Ingrese un nombre de lugar'
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
										rule: FilterRules.CONTAINS,
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
										API de Google Text Search.
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

'use client'

import { createActivity } from '@/common/actions/activity-template.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputMask from '@/common/components/ui/form/input-mask'
import { UPSERT_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import useResponse from '@/common/hooks/use-response'
import { CreateActivityModel } from '@/common/models'
import { useLoading } from '@/common/stores/loading.store'
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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import {
	upsertFormSchema,
	type UpsertFormSchema,
} from '../_schemas/upsert-form.schema'

type Props = {
	activityTemplateId: string
}

const UpsertForm = ({ activityTemplateId }: Readonly<Props>) => {
	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			name: '',
			description: '',
		},
		resolver: zodResolver(upsertFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async (values: UpsertFormSchema) => {
		setLoading(true)

		const activity: CreateActivityModel = {
			...values,
		}

		await createActivity(activityTemplateId, activity)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Actividades',
					description: 'Actividad creada correctamente',
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
				id={UPSERT_FORM_ID}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:px-1'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Nombre<span className='text-orange-500'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder='Ingrese un nombre'
									aria-label='Nombre'
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
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Descripción<span className='text-orange-500'>*</span>
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Ingrese una descripción'
									className='resize-none'
									aria-label='Descripción'
									aria-required='true'
									rows={8}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='duration'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Duración</FormLabel>
							<FormDescription id='duration-description'>
								Duración estimada de la actividad en minutos
							</FormDescription>
							<FormControl>
								<InputMask
									type='number'
									placeholder='Ingrese la duración estimada'
									aria-label='Duración Estimada'
									aria-describedby='duration-description'
									aria-required='false'
									options={{
										numericOnly: true,
										numeralPositiveOnly: true,
										numeralDecimalScale: 0,
									}}
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
			</form>
		</Form>
	)
}

export default UpsertForm

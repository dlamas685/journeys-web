'use client'

import { create, update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import { UPSERT_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import type {
	ActivityTemplateModel,
	CreateActivityTemplate,
	UpdateActivityTemplateModel,
} from '@/common/models'
import { useLoading } from '@/common/stores/loading.store'
import {
	Form,
	FormControl,
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
import { upsertFormSchema, type UpsertFormSchema } from '../_schemas'

type Props = {
	record?: ActivityTemplateModel
}

const UpsertForm = ({ record }: Readonly<Props>) => {
	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			id: record?.id ?? undefined,
			name: record?.name ?? '',
			description: record?.description ?? '',
		},
		resolver: zodResolver(upsertFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ id, ...rest }: UpsertFormSchema) => {
		setLoading(true)

		if (id) {
			const activityTemplate: UpdateActivityTemplateModel = {
				...rest,
			}

			await update<UpdateActivityTemplateModel, ActivityTemplateModel>(
				ApiEndpoints.ACTIVITY_TEMPLATES,
				id,
				activityTemplate
			)
				.then(resp => {
					if ('error' in resp) {
						throw new ApiError(resp)
					}

					response.success({
						title: 'Plantillas de Actividades',
						description: `${record?.name} ha sido actualizada`,
					})

					form.reset()
					setOpen(false)
				})
				.catch(response.error)
				.finally(() => {
					setLoading(false)
				})
			return
		}

		const activityTemplate: CreateActivityTemplate = {
			...rest,
		}

		await create<CreateActivityTemplate, ActivityTemplateModel>(
			ApiEndpoints.ACTIVITY_TEMPLATES,
			activityTemplate
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Plantillas de Actividades',
					description:
						'La plantilla de actividades ha sido creada correctamente.',
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
				className='grid max-h-96 grid-cols-2 gap-2 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:gap-3 sm:px-1'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>Nombre</FormLabel>
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
						<FormItem className='col-span-full'>
							<FormLabel>Descripción</FormLabel>
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
			</form>
		</Form>
	)
}

export default UpsertForm

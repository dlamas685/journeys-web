'use client'

import { update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import { UPSERT_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { RoadmapModel, UpdateRoadmapModel } from '../_models'
import { updateFormSchema, UpsertFormSchema } from '../_schemas'

type Props = {
	record: RoadmapModel
}

const UpdateForm = ({ record }: Readonly<Props>) => {
	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			id: record.id,
			alias: record.code,
		},
		resolver: zodResolver(updateFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ id, alias }: UpsertFormSchema) => {
		setLoading(true)

		const updateModel: UpdateRoadmapModel = {
			code: alias,
		}

		await update<UpdateRoadmapModel, RoadmapModel>(
			ApiEndpoints.ROADMAPS,
			id,
			updateModel
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Hojas de Ruta',
					description: 'La hoja de ruta ha sido actualizada correctamente.',
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
				className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:grid-cols-2 sm:px-1'>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis!
				</p>
			</form>
		</Form>
	)
}

export default UpdateForm

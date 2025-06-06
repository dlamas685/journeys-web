'use client'

import { update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import { UPDATE_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { TripModel } from '../_models'
import { UpdateTripModel } from '../_models/update-trip.model'
import { updateFormSchema, type UpdateFormSchema } from '../_schemas'

type Props = {
	record: TripModel
}

const UpdateForm = ({ record }: Readonly<Props>) => {
	const form = useForm<UpdateFormSchema>({
		defaultValues: {
			id: record.id,
			alias: record.code,
		},
		resolver: zodResolver(updateFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ id, alias }: UpdateFormSchema) => {
		setLoading(true)

		const updateModel: UpdateTripModel = {
			code: alias,
		}

		await update<UpdateTripModel, TripModel>(
			ApiEndpoints.TRIPS,
			id,
			updateModel
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Viajes',
					description: 'El viaje ha sido actualizado correctamente.',
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
				id={UPDATE_FORM_ID}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:px-1'>
				<FormField
					control={form.control}
					name='alias'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Alias</FormLabel>
							<FormControl>
								<Input
									placeholder='Ingrese un alias para su viaje'
									aria-label='Alias del viaje'
									aria-required='true'
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

export default UpdateForm

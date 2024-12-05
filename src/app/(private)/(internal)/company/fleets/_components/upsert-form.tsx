'use client'

import { create, update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import { UPSERT_FORM_ID } from '@/common/constants'
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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { CreateFleetModel, FleetModel, UpdateFleetModel } from '../_models'
import { upsertFormSchema, UpsertFormSchema } from '../_schemas'

type Props = {
	record?: FleetModel
}

const UpsertForm = ({ record }: Readonly<Props>) => {
	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			id: record?.id ?? undefined,
			name: record?.name ?? '',
			description: record?.description ?? '',
			maxDrivers: record?.maxDrivers ?? undefined,
			maxVehicles: record?.maxVehicles ?? undefined,
		},
		resolver: zodResolver(upsertFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ id, ...rest }: UpsertFormSchema) => {
		setLoading(true)

		if (id) {
			const fleet: UpdateFleetModel = {
				...rest,
			}

			await update<UpdateFleetModel, FleetModel>(ApiEndpoints.FLEETS, id, fleet)
				.then(resp => {
					if ('error' in resp) {
						throw new ApiError(resp)
					}

					response.success({
						title: 'Flotas',
						description: `${resp.name} ha sido actualizada`,
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

		const fleet: CreateFleetModel = {
			...rest,
		}

		await create<CreateFleetModel, FleetModel>(ApiEndpoints.FLEETS, fleet)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Flotas',
					description: 'La flota ha sido creada correctamente.',
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
						<FormItem className='col-span-full'>
							<FormLabel>Descripción</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Ingrese una descripción'
									className='resize-none'
									aria-label='Descripción'
									aria-required='false'
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
					name='maxVehicles'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cantidad de vehículos</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Ingrese un número'
									aria-label='Cantidad de vehículos'
									aria-required='false'
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

				<FormField
					control={form.control}
					name='maxDrivers'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cantidad de conductores</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Ingrese un número'
									aria-label='Cantidad de conductores'
									aria-required='false'
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

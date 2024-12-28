'use client'

import { ApiError } from '@/common/classes/api-error.class'
import { UPDATE_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { useDataTableContext } from '@/common/hooks/use-data-table-context'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import type { VehicleModel } from '../../../../vehicles/_models'
import { relateVehiclesToFleet } from '../../../_actions/fleets.action'
import { RelationOperations } from '../../../_enums/relation-operations.enum'
import {
	vehicleLinkFormSchema,
	VehicleLinkFormSchema,
} from '../_schemas/vehicle-link-form.schema'

type Props = {
	fleetId: string
}

const VehicleLinkForm = ({ fleetId }: Readonly<Props>) => {
	const { dependencies } = useDataTableContext<VehicleModel>()

	const vehiclesWithoutFleets = (dependencies?.vehiclesWithoutFleets ??
		[]) as VehicleModel[]

	const form = useForm<VehicleLinkFormSchema>({
		defaultValues: {
			ids: [],
		},
		resolver: zodResolver(vehicleLinkFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ ids }: VehicleLinkFormSchema) => {
		setLoading(true)

		await relateVehiclesToFleet(fleetId, {
			vehicleIds: ids,
			operation: RelationOperations.LINK,
		})
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Flotas',
					description: 'Vehículos vinculados correctamente',
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
				className='flex max-h-96 overflow-y-auto px-4 pb-2 sm:max-h-[500px] sm:px-1 sm:pb-0'>
				<FormField
					control={form.control}
					name='ids'
					render={({ field }) => (
						<FormItem>
							{vehiclesWithoutFleets.map(item => (
								<FormField
									key={item.id}
									control={form.control}
									name='ids'
									render={({ field }) => {
										return (
											<FormItem
												key={item.id}
												className='flex flex-row items-start space-x-3 space-y-0'>
												<FormControl>
													<Checkbox
														checked={field.value?.includes(item.id)}
														onCheckedChange={checked => {
															return checked
																? field.onChange([...field.value, item.id])
																: field.onChange(
																		field.value?.filter(
																			value => value !== item.id
																		)
																	)
														}}
													/>
												</FormControl>
												<FormLabel className='SelectPlaceHolder'>
													{item.licensePlate} - {item.make} - {item.model} -{' '}
													{item.year}
												</FormLabel>
											</FormItem>
										)
									}}
								/>
							))}
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default VehicleLinkForm

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
import { DriverModel } from '../../../../drivers/_models'
import type { VehicleModel } from '../../../../vehicles/_models'
import { relateDriversToFleet } from '../../../_actions/fleets.action'
import { RelationOperations } from '../../../_enums/relation-operations.enum'
import {
	driverLinkFormSchema,
	DriverLinkFormSchema,
} from '../_schemas/driver-link-form.schema'

type Props = {
	fleetId: string
}

const VehicleLinkForm = ({ fleetId }: Readonly<Props>) => {
	const { dependencies } = useDataTableContext<VehicleModel>()

	const driversWithoutFleets = (dependencies?.driversWithoutFleets ??
		[]) as DriverModel[]

	const form = useForm<DriverLinkFormSchema>({
		defaultValues: {
			ids: [],
		},
		resolver: zodResolver(driverLinkFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ ids }: DriverLinkFormSchema) => {
		setLoading(true)

		await relateDriversToFleet(fleetId, {
			driverIds: ids,
			operation: RelationOperations.LINK,
		})
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Flotas',
					description: 'Conductores vinculados correctamente',
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
							{driversWithoutFleets.map(item => (
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
													{item.name} - {item.licenseNumber}
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

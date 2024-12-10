'use client'

import { create, update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputMask from '@/common/components/ui/form/input-mask'
import { UPSERT_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { ApiEndpoints } from '@/common/enums'
import { useDataTableContext } from '@/common/hooks/use-data-table-context'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { FleetModel } from '../../fleets/_models'
import {
	CreateVehicleModel,
	UpdateVehicleModel,
	VehicleModel,
} from '../_models'
import { upsertFormSchema, UpsertFormSchema } from '../_schemas'

type Props = {
	record?: VehicleModel
}

const UpsertForm = ({ record }: Readonly<Props>) => {
	const { dependencies } = useDataTableContext()

	const fleets = dependencies?.fleets as FleetModel[]

	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			id: record?.id ?? undefined,
			fleetId: record?.fleetId ?? undefined,
			licensePlate: record?.licensePlate ?? '',
			make: record?.make ?? '',
			model: record?.model ?? '',
			year: record?.year ?? undefined,
			vin: record?.vin ?? undefined,
			notes: record?.notes ?? '',
		},
		resolver: zodResolver(upsertFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const response = useResponse()

	const handleSubmit = async ({ id, ...rest }: UpsertFormSchema) => {
		setLoading(true)

		if (id) {
			const vehicle: UpdateVehicleModel = {
				...rest,
			}

			await update<UpdateVehicleModel, VehicleModel>(
				ApiEndpoints.VEHICLES,
				id,
				vehicle
			)
				.then(resp => {
					if ('error' in resp) {
						throw new ApiError(resp)
					}

					response.success({
						title: 'Vehículos',
						description: 'El vehículo ha sido actualizado correctamente.',
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

		const vehicle: CreateVehicleModel = {
			...rest,
		}

		await create<CreateVehicleModel, VehicleModel>(
			ApiEndpoints.VEHICLES,
			vehicle
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Vehículos',
					description: 'El vehículo ha sido creado correctamente.',
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
					name='licensePlate'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>
								Patente<span className='text-orange-500'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder='Ingrese la placa del vehículo'
									aria-label='Placa'
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
					name='make'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Marca</FormLabel>
							<FormControl>
								<Input
									placeholder='Ingrese la marca del vehículo'
									aria-label='Marca'
									aria-required='false'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='model'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Modelo</FormLabel>
							<FormControl>
								<Input
									placeholder='Ingrese el modelo del vehículo'
									aria-label='Modelo'
									aria-required='false'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='year'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Año</FormLabel>
							<FormControl>
								<InputMask
									placeholder='Ingrese el año del vehículo'
									aria-label='Año'
									aria-required='false'
									{...field}
									options={{
										numericOnly: true,
										blocks: [4],
									}}
									onChange={e => {
										const value = e.target.value
											? parseInt(e.target.value)
											: undefined
										field.onChange(value)
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='fleetId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Flota</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Seleccione una flota' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{fleets.map(fleet => (
										<SelectItem key={fleet.id} value={fleet.id}>
											{fleet.name}
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
					name='vin'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>Número de identificación vehicular (VIN)</FormLabel>
							<FormControl>
								<InputMask
									placeholder='Ingrese el número de identificación vehicular'
									aria-label='Número de identificación vehicular (VIN)'
									aria-required='false'
									options={{
										blocks: [17],
									}}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='notes'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>Notas</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Ingresar notas del vehículo'
									className='resize-none'
									aria-label='Notas'
									aria-required='false'
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

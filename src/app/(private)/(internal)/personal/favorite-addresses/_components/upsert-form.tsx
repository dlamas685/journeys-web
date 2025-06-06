'use client'

import { create, update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import Autocomplete from '@/common/components/ui/google/autocomplete'
import { MAP_CENTER, UPSERT_FORM_ID } from '@/common/constants'
import { DialogContext } from '@/common/contexts/dialog-context'
import { ApiEndpoints } from '@/common/enums'
import { useMediaQuery } from '@/common/hooks/use-media-query'
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
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import type {
	CreateFavoriteAddressModel,
	FavoriteAddressModel,
	UpdateFavoriteAddressModel,
} from '../_models'
import { type UpsertFormSchema, upsertFormSchema } from '../_schemas'

type Props = {
	record?: FavoriteAddressModel
}

const UpsertForm = ({ record }: Readonly<Props>) => {
	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			id: record?.id ?? undefined,
			alias: record?.alias ?? '',
			address: record?.address ?? '',
			location: record?.location ?? undefined,
			placeId: record?.placeId ?? undefined,
		},
		resolver: zodResolver(upsertFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const isDesktop = useMediaQuery('(min-width: 768px)')

	const response = useResponse()

	const [zoomLevel, setZoomLevel] = useState(
		record?.location.latitude && record?.location.longitude ? 16 : 12
	)

	const [mapCenter, setMapCenter] = useState({
		lat: record?.location.latitude ?? MAP_CENTER.lat,
		lng: record?.location.longitude ?? MAP_CENTER.lng,
	})

	const [centerOnPlace, setCenterOnPlace] = useState(
		!!(record?.location.latitude && record?.location.longitude)
	)

	const lat = form.watch('location.latitude')

	const lng = form.watch('location.longitude')

	const handleSubmit = async ({
		id,
		address,
		location,
		...rest
	}: UpsertFormSchema) => {
		setLoading(true)

		if (id) {
			const favoriteAddress: UpdateFavoriteAddressModel = {
				...rest,
			}

			await update<UpdateFavoriteAddressModel, FavoriteAddressModel>(
				ApiEndpoints.FAVORITE_ADDRESSES,
				id,
				favoriteAddress
			)
				.then(resp => {
					if ('error' in resp) {
						throw new ApiError(resp)
					}

					response.success({
						title: 'Direcciones favoritas',
						description: 'La dirección favorita ha sido actualizada',
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

		const favoriteAddress: CreateFavoriteAddressModel = {
			...rest,
		}

		await create<CreateFavoriteAddressModel, FavoriteAddressModel>(
			ApiEndpoints.FAVORITE_ADDRESSES,
			favoriteAddress
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Direcciones favoritas',
					description: 'La dirección ha sido agregada a favoritas.',
				})

				form.reset()
				setOpen(false)
			})
			.catch(response.error)
			.finally(() => {
				setLoading(false)
			})
	}

	const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
		if (place) {
			const lat = place.geometry?.location?.lat()
			const lng = place.geometry?.location?.lng()
			const placeId = place.place_id

			if (placeId) {
				form.setValue('placeId', placeId)
			} else {
				form.resetField('placeId')
			}

			if (lat && lng) {
				setZoomLevel(16)
				setMapCenter({ lat, lng })
				setCenterOnPlace(true)
				form.setValue('location.latitude', lat)
				form.setValue('location.longitude', lng)
			} else {
				setZoomLevel(12)
				form.resetField('location.latitude')
				form.resetField('location.longitude')
			}
		}
	}

	return (
		<Form {...form}>
			<form
				id={UPSERT_FORM_ID}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:px-1'>
				<FormField
					control={form.control}
					name='alias'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Alias</FormLabel>
							<FormControl>
								<Input placeholder='Ingrese un alias' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='address'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dirección</FormLabel>
							<FormControl>
								<Autocomplete
									value={field.value}
									placeholder='Buscar dirección'
									searchPlaceholder='Ingresa una dirección'
									searchType={['address']}
									onPlaceSelect={place => {
										field.onChange(place?.formatted_address)
										handlePlaceSelect(place)
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Map
					className='h-64 w-full'
					defaultCenter={MAP_CENTER}
					center={centerOnPlace ? mapCenter : undefined}
					zoom={zoomLevel}
					disableDefaultUI={true}
					fullscreenControl={isDesktop}
					onDragstart={() => setCenterOnPlace(false)}
					reuseMaps
					mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}>
					{lat && lng && (
						<AdvancedMarker
							position={{
								lat: lat as number,
								lng: lng as number,
							}}
						/>
					)}
				</Map>
			</form>
		</Form>
	)
}

export default UpsertForm

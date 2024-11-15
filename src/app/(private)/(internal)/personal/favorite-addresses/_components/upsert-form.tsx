// CreatorForm.tsx

'use client'

import { create, update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputPlace from '@/common/components/ui/google/input-place'
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
import {
	CreateFavoriteAddressModel,
	FavoriteAddressModel,
	UpdateFavoriteAddressModel,
} from '../_models'
import { UpsertFormSchema, upsertFormSchema } from '../_schemas'

type Props = {
	record?: FavoriteAddressModel
}

const UpsertForm = ({ record }: Readonly<Props>) => {
	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			id: record?.id ?? undefined,
			alias: record?.alias ?? '',
			address: record?.address ?? '',
			latitude: record?.latitude ?? undefined,
			longitude: record?.longitude ?? undefined,
			placeId: record?.placeId ?? undefined,
		},
		resolver: zodResolver(upsertFormSchema),
	})

	const setLoading = useLoading(state => state.setLoading)

	const { setOpen } = useContext(DialogContext)

	const isDesktop = useMediaQuery('(min-width: 768px)')

	const response = useResponse()

	const [zoomLevel, setZoomLevel] = useState(
		record?.latitude && record?.longitude ? 16 : 12
	)

	const [mapCenter, setMapCenter] = useState({
		lat: record?.latitude ?? MAP_CENTER.lat,
		lng: record?.longitude ?? MAP_CENTER.lng,
	})

	const [centerOnPlace, setCenterOnPlace] = useState(
		!!(record?.latitude && record?.longitude)
	)

	const lat = form.watch('latitude')

	const lng = form.watch('longitude')

	const handleSubmit = async ({ id, address, ...rest }: UpsertFormSchema) => {
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
						description: `${resp.alias} ha sido actualizado`,
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
					description: 'Dirección favorita creada con éxito',
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
				form.setValue('latitude', lat)
				form.setValue('longitude', lng)
			} else {
				setZoomLevel(12)
				form.resetField('latitude')
				form.resetField('longitude')
			}
		}
	}

	return (
		<Form {...form}>
			<form
				id={UPSERT_FORM_ID}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid max-h-96 grid-cols-1 gap-2 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:gap-3 sm:px-1'>
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
								<InputPlace
									value={field.value}
									placeholder='Buscar dirección'
									searchPlaceholder='Ingresa una dirección'
									searchType='address'
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

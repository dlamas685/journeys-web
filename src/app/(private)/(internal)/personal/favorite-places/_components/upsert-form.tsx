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
import { zodResolver } from '@hookform/resolvers/zod'
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import type {
	CreateFavoritePlaceModel,
	FavoritePlaceModel,
	UpdateFavoritePlaceModel,
} from '../_models'
import { type UpsertFormSchema, upsertFormSchema } from '../_schemas'

type Props = {
	record?: FavoritePlaceModel
}

const UpsertForm = ({ record }: Readonly<Props>) => {
	const form = useForm<UpsertFormSchema>({
		defaultValues: {
			id: record?.id ?? undefined,
			name: record?.name ?? '',
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

	const handleSubmit = async ({
		id,
		name,
		latitude,
		longitude,
		...rest
	}: UpsertFormSchema) => {
		setLoading(true)

		if (id) {
			const favoritePlace: UpdateFavoritePlaceModel = {
				...rest,
			}

			await update<UpdateFavoritePlaceModel, FavoritePlaceModel>(
				ApiEndpoints.FAVORITE_PLACES,
				id,
				favoritePlace
			)
				.then(resp => {
					if ('error' in resp) {
						throw new ApiError(resp)
					}

					response.success({
						title: 'Lugares favoritos',
						description: 'El lugar ha sido actualizado correctamente.',
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

		const favoritePlace: CreateFavoritePlaceModel = {
			...rest,
		}

		await create<CreateFavoritePlaceModel, FavoritePlaceModel>(
			ApiEndpoints.FAVORITE_PLACES,
			favoritePlace
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Lugares favoritos',
					description: 'El lugar ha sido agregado a favoritos.',
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
				className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 pb-2 sm:max-h-[inherit] sm:px-1'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre</FormLabel>
							<FormControl>
								<Autocomplete
									value={field.value}
									placeholder='Buscar lugar'
									searchPlaceholder='Ingresa el nombre del lugar'
									searchType={['establishment']}
									onPlaceSelect={place => {
										field.onChange(place?.name)
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

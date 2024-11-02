// CreatorForm.tsx

'use client'

import { create } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import InputPlace from '@/common/components/ui/google/input-place'
import { CREATOR_FORM_ID, MAP_CENTER } from '@/common/constants'
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
import { CreateFavoriteAddressModel, FavoriteAddressModel } from '../_models'
import { creatorFormSchema, CreatorFormSchema } from '../_schemas'

const CreatorForm = () => {
	const form = useForm<CreatorFormSchema>({
		defaultValues: {
			alias: '',
			address: '',
		},
		resolver: zodResolver(creatorFormSchema),
	})

	const setIsLoading = useLoading(state => state.setIsLoading)

	const { setOpen } = useContext(DialogContext)

	const isDesktop = useMediaQuery('(min-width: 768px)')

	const response = useResponse()

	const [zoomLevel, setZoomLevel] = useState(12)

	const lat = form.watch('latitude')

	const lng = form.watch('longitude')

	const handleSubmit = async (values: CreatorFormSchema) => {
		const favoriteAddress: CreateFavoriteAddressModel = {
			...values,
		}

		setIsLoading(true)

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
				setIsLoading(false)
			})
	}

	const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
		if (place) {
			const lat = place.geometry?.location?.lat()
			const lng = place.geometry?.location?.lng()
			const placeId = place.place_id

			if (placeId) {
				form.setValue('placeId', placeId)
			}

			if (lat && lng) {
				setZoomLevel(15)
				form.setValue('latitude', lat)
				form.setValue('longitude', lng)
			}
		}
	}

	return (
		<Form {...form}>
			<form
				id={CREATOR_FORM_ID}
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
					center={{
						lat: lat ?? MAP_CENTER.lat,
						lng: lng ?? MAP_CENTER.lng,
					}}
					zoom={zoomLevel}
					disableDefaultUI={true}
					fullscreenControl={isDesktop}
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

export default CreatorForm

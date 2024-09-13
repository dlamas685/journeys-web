import { useMediaQuery } from '@/common/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { FormEvent, useCallback, useEffect, useState } from 'react'

type Props = {
	placeholder?: string
	value?: string
	searchPlaceholder?: string
	transparent?: boolean
	muted?: boolean
	emptyMessage?: string
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

const InputPlace = ({
	onPlaceSelect,
	value,
	placeholder,
	searchPlaceholder,
	emptyMessage,
	muted = true,
	transparent,
}: Readonly<Props>) => {
	const isDesktop = useMediaQuery('(min-width: 768px)')

	const places = useMapsLibrary('places')
	const [open, setOpen] = useState(false)

	const [sessionToken, setSessionToken] =
		useState<google.maps.places.AutocompleteSessionToken>()

	const [autocompleteService, setAutocompleteService] =
		useState<google.maps.places.AutocompleteService | null>(null)

	const [placesService, setPlacesService] =
		useState<google.maps.places.PlacesService | null>(null)

	const [predictionResults, setPredictionResults] = useState<
		Array<google.maps.places.AutocompletePrediction>
	>([])

	const [inputValue, setInputValue] = useState<string>(value ?? '')

	useEffect(() => {
		if (!places) return

		setAutocompleteService(new places.AutocompleteService())
		setSessionToken(new places.AutocompleteSessionToken())

		const dummyElement = document.createElement('div')
		setPlacesService(new google.maps.places.PlacesService(dummyElement))

		return () => setAutocompleteService(null)
	}, [places])

	const fetchPredictions = useCallback(
		async (inputValue: string) => {
			if (!autocompleteService || !inputValue) {
				setPredictionResults([])
				return
			}

			const request: google.maps.places.AutocompletionRequest = {
				input: inputValue,
				sessionToken,
			}

			const response = await autocompleteService.getPlacePredictions(request)

			setPredictionResults(response.predictions)
		},
		[autocompleteService, sessionToken]
	)

	const onInputChange = useCallback(
		(event: FormEvent<HTMLInputElement>) => {
			const value = (event.target as HTMLInputElement)?.value

			setInputValue(value)
			fetchPredictions(value)
		},
		[fetchPredictions]
	)

	const handleSuggestionClick = useCallback(
		(placeId: string) => {
			if (!places) return

			const detailRequestOptions: google.maps.places.PlaceDetailsRequest = {
				placeId,
				fields: ['geometry', 'name', 'formatted_address'],
				sessionToken,
			}

			const detailsRequestCallback = (
				placeDetails: google.maps.places.PlaceResult | null
			) => {
				onPlaceSelect(placeDetails)
				setPredictionResults([])
				setInputValue(placeDetails?.formatted_address ?? '')
				setSessionToken(new places.AutocompleteSessionToken())
			}

			placesService?.getDetails(detailRequestOptions, detailsRequestCallback)
		},
		[onPlaceSelect, places, placesService, sessionToken]
	)

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						title={inputValue}
						className={cn(
							'w-full justify-between font-normal text-muted-foreground px-3 py-5',
							muted && 'bg-muted  border-none',
							transparent && 'bg-transparent'
						)}>
						<span className='max-w-xs overflow-hidden text-ellipsis'>
							{inputValue ? inputValue : placeholder}
						</span>
						<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0'>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder={searchPlaceholder}
							value={inputValue}
							onInput={(event: FormEvent<HTMLInputElement>) =>
								onInputChange(event)
							}
						/>
						<CommandList>
							<CommandEmpty>
								<p className='p-3 text-sm text-muted-foreground'>
									{emptyMessage ?? 'No se encontraron resultados'}
								</p>
							</CommandEmpty>
							{predictionResults.map(({ place_id, description }) => (
								<CommandItem
									key={place_id}
									value={place_id}
									onSelect={currentValue => {
										handleSuggestionClick(currentValue)
										setOpen(false)
									}}>
									{description}
								</CommandItem>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					title={inputValue}
					className={cn(
						'w-full justify-between font-normal text-muted-foreground px-3 py-5',
						muted && 'bg-muted  border-none',
						transparent && 'bg-transparent'
					)}>
					<span className='max-w-xs overflow-hidden text-ellipsis'>
						{inputValue ? inputValue : placeholder}
					</span>
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<Command shouldFilter={false}>
					<CommandInput
						placeholder={searchPlaceholder}
						value={inputValue}
						onInput={(event: FormEvent<HTMLInputElement>) =>
							onInputChange(event)
						}
					/>
					<CommandList>
						<CommandEmpty>
							<p className='p-3 text-sm text-muted-foreground'>
								{emptyMessage ?? 'No se encontraron resultados'}
							</p>
						</CommandEmpty>
						{predictionResults.map(({ place_id, description }) => (
							<CommandItem
								key={place_id}
								value={place_id}
								onSelect={currentValue => {
									handleSuggestionClick(currentValue)
									setOpen(false)
								}}>
								{description}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</DrawerContent>
		</Drawer>
	)
}

export default InputPlace

'use client'
import { findAll } from '@/common/actions/crud.action'
import Autocomplete from '@/common/components/ui/google/autocomplete'
import Modal from '@/common/components/ui/overlay/modal'
import { MAP_CENTER } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import { useMediaQuery } from '@/common/hooks/use-media-query'

import { useLoading } from '@/common/stores/loading.store'
import { resolveComponentType } from '@/common/utils'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import {
	CheckCircle2,
	CircleMinus,
	ListCollapse,
	LoaderCircle,
	LocateFixed,
	MapPinned,
	Settings2,
} from 'lucide-react'
import {
	Children,
	cloneElement,
	ComponentProps,
	forwardRef,
	isValidElement,
	ReactElement,
	ReactNode,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { FavoriteAddressModel } from '../../favorite-addresses/_models'
import { FavoritePlaceModel } from '../../favorite-places/_models'
import { WaypointSettingContext } from '../_contexts/WaypointSettingContext'
import { useWaypointSetting } from '../_hooks/useWaypointSetting'
import { LocationModel, WaypointModel } from '../_models'
import { ListBox, ListBoxItem } from './list-box'

type WaypointSettingProps = {
	title: string
	description: string
	children: ReactNode
	value?: WaypointModel[]
	isMultipleSelection?: boolean
	onReady?: (waypoints: WaypointModel[]) => void
}

const WaypointSetting = forwardRef<HTMLDivElement, WaypointSettingProps>(
	(
		{
			title,
			description,
			children,
			value,
			isMultipleSelection = false,
			onReady,
		}: Readonly<WaypointSettingProps>,
		ref
	) => {
		const isDesktop = useMediaQuery('(min-width: 40rem)')
		const isLoading = useLoading(store => store.loading)

		const [open, setOpen] = useState<boolean>(false)

		const [waypointsSelected, setWaypointsSelected] = useState<
			WaypointModel[] | undefined
		>([])

		const [favoritePlaces, setFavoritePlaces] = useState<FavoritePlaceModel[]>(
			[]
		)

		const [favoriteAddresses, setFavoriteAddresses] = useState<
			FavoriteAddressModel[]
		>([])

		let tabs: ReactElement | null = null

		let list: ReactElement | null = null

		Children.forEach(children, child => {
			if (!isValidElement(child)) return

			const childType = child.type

			const resolvedType = resolveComponentType(childType)

			switch (resolvedType) {
				case WaypointSettingTabs:
					tabs = child
					break
				case WaypointSettingList:
					list = child
					break
				default:
					console.warn('Unknown component:', child.type)
			}
		})

		const handleReady = () => {
			if (waypointsSelected) {
				onReady?.(waypointsSelected)
				setOpen(false)
			}
		}

		useEffect(() => {
			const fetchFavoritePlaces = async () => {
				const response = await findAll<FavoritePlaceModel>(
					ApiEndpoints.FAVORITE_PLACES,
					{},
					Pathnames.OPTIMIZATION
				)
				setFavoritePlaces(response.data)
			}

			const fetchFavoriteAddresses = async () => {
				const response = await findAll<FavoriteAddressModel>(
					ApiEndpoints.FAVORITE_ADDRESSES,
					{},
					Pathnames.OPTIMIZATION
				)
				setFavoriteAddresses(response.data)
				setWaypointsSelected(value)
			}

			fetchFavoritePlaces()
			fetchFavoriteAddresses()
		}, [value])

		if (isDesktop) {
			return (
				<WaypointSettingContext.Provider
					value={{
						open,
						setOpen,
						waypointsSelected,
						setWaypointsSelected,
						favoriteAddresses,
						favoritePlaces,
						setFavoritePlaces,
						setFavoriteAddresses,
						isMultipleSelection,
					}}>
					<section ref={ref}>
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button
									variant='secondary'
									className='font-normal text-muted-foreground'>
									<Settings2 className='mr-1 size-4' />
									Configurar
								</Button>
							</DialogTrigger>
							<DialogContent className='gap-3 sm:max-w-[26.5625rem] md:max-w-[32rem]'>
								<DialogHeader className='px-1'>
									<DialogTitle>{title}</DialogTitle>
									<DialogDescription>{description}</DialogDescription>
								</DialogHeader>
								{tabs}
								<DialogFooter>
									<Button type='button' onClick={handleReady}>
										{isLoading ? (
											<LoaderCircle className='mr-1 size-4 animate-spin' />
										) : (
											<CheckCircle2 className='mr-1 size-4' />
										)}
										Listo
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						{list}
					</section>
				</WaypointSettingContext.Provider>
			)
		}

		return (
			<WaypointSettingContext.Provider
				value={{
					open,
					setOpen,
					waypointsSelected,
					setWaypointsSelected,
					favoriteAddresses,
					favoritePlaces,
					setFavoritePlaces,
					setFavoriteAddresses,
					isMultipleSelection,
				}}>
				<section
					ref={ref}
					className={cn('space-x-2', {
						'space-y-0': waypointsSelected && waypointsSelected.length > 2,
					})}>
					<Drawer open={open} onOpenChange={setOpen}>
						<DrawerTrigger asChild>
							<Button
								variant='secondary'
								className='font-normal text-muted-foreground'>
								<Settings2 className='mr-1 size-4' />
								Configurar
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader className='text-left'>
								<DrawerTitle>{title}</DrawerTitle>
								<DrawerDescription>{description}</DrawerDescription>
							</DrawerHeader>
							{tabs}
							<DrawerFooter className='md:pt-2'>
								<Button type='button' onClick={handleReady}>
									{isLoading ? (
										<LoaderCircle className='mr-1 size-4 animate-spin' />
									) : (
										<CheckCircle2 className='mr-1 size-4' />
									)}
									Listo
								</Button>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
					{list}
				</section>
			</WaypointSettingContext.Provider>
		)
	}
)

WaypointSetting.displayName = 'WaypointSetting'

type WaypointSettingTabsProps = {}

const WaypointSettingTabs = ({}: Readonly<WaypointSettingTabsProps>) => {
	const {
		waypointsSelected,
		setWaypointsSelected,
		isMultipleSelection,
		favoriteAddresses,
		favoritePlaces,
	} = useWaypointSetting()

	const isDesktop = useMediaQuery('(min-width: 40rem)')

	const manualWaypoints = useMemo(
		() =>
			waypointsSelected?.filter(
				waypoint =>
					favoriteAddresses.findIndex(
						favorite => favorite.placeId === waypoint.placeId
					) === -1 &&
					favoritePlaces.findIndex(
						favorite => favorite.placeId === waypoint.placeId
					) === -1
			) ?? [],
		[waypointsSelected, favoriteAddresses, favoritePlaces]
	)

	const [zoomLevel, setZoomLevel] = useState(
		!isMultipleSelection &&
			manualWaypoints &&
			manualWaypoints[0]?.location?.latLng.latitude &&
			manualWaypoints[0].location.latLng.longitude
			? 16
			: 12
	)

	const [mapCenter, setMapCenter] = useState(
		!isMultipleSelection && waypointsSelected
			? {
					lat:
						waypointsSelected[0]?.location?.latLng.latitude ?? MAP_CENTER.lat,
					lng:
						waypointsSelected[0]?.location?.latLng.longitude ?? MAP_CENTER.lng,
				}
			: MAP_CENTER
	)

	const [centerOnPlace, setCenterOnPlace] = useState(
		!!(
			!isMultipleSelection &&
			waypointsSelected &&
			waypointsSelected[0]?.location?.latLng.latitude &&
			waypointsSelected[0].location.latLng.longitude
		)
	)

	const handleSelectedFavoriteAddress = (
		favoriteAddress: FavoriteAddressModel
	) => {
		const latitude = favoriteAddress.latitude

		const longitude = favoriteAddress.longitude

		const placeId = favoriteAddress.placeId

		const address = favoriteAddress.address

		const location: LocationModel | undefined =
			latitude && longitude ? { latLng: { latitude, longitude } } : undefined

		if (placeId && location && address) {
			setMapCenter(MAP_CENTER)

			setZoomLevel(12)

			setCenterOnPlace(false)

			const waypoint: WaypointModel = {
				placeId,
				location,
				address,
			}

			if (isMultipleSelection) {
				setWaypointsSelected(prev => {
					if (!prev) return [waypoint]

					const found = prev.find(
						selected => selected.placeId === waypoint.placeId
					)

					if (found) {
						return prev.filter(
							selected => selected.placeId !== waypoint.placeId
						)
					}

					return [...prev, waypoint]
				})

				return
			}

			setWaypointsSelected([waypoint])
		}
	}

	const handleSelectedFavoritePlaces = (favoritePlace: FavoritePlaceModel) => {
		const latitude = favoritePlace.latitude

		const longitude = favoritePlace.longitude

		const placeId = favoritePlace.placeId

		const address = favoritePlace.address

		const name = favoritePlace.name

		const location: LocationModel | undefined =
			latitude && longitude ? { latLng: { latitude, longitude } } : undefined

		if (placeId && location && address) {
			setMapCenter(MAP_CENTER)

			setZoomLevel(12)

			setCenterOnPlace(false)

			const waypoint: WaypointModel = {
				placeId,
				location,
				address,
				name,
			}

			if (isMultipleSelection) {
				setWaypointsSelected(prev => {
					if (!prev) return [waypoint]

					const found = prev.find(
						selected => selected.placeId === waypoint.placeId
					)

					if (found) {
						return prev.filter(
							selected => selected.placeId !== waypoint.placeId
						)
					}

					return [...prev, waypoint]
				})

				return
			}

			setWaypointsSelected([waypoint])
		}
	}

	const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
		const latitude = place?.geometry?.location?.lat()

		const longitude = place?.geometry?.location?.lng()

		const placeId = place?.place_id

		const address = place?.formatted_address

		const location: LocationModel | undefined =
			latitude && longitude ? { latLng: { latitude, longitude } } : undefined

		if (placeId && location && address) {
			setMapCenter({
				lat: latitude as number,
				lng: longitude as number,
			})

			setZoomLevel(16)

			setCenterOnPlace(true)

			const waypoint: WaypointModel = {
				placeId,
				location,
				address,
			}

			if (isMultipleSelection) {
				setWaypointsSelected(prev => {
					if (!prev) return [waypoint]

					const found = prev.find(
						selected => selected.placeId === waypoint.placeId
					)

					if (found) {
						return prev.filter(
							selected => selected.placeId !== waypoint.placeId
						)
					}

					return [...prev, waypoint]
				})
			} else {
				setWaypointsSelected([waypoint])
			}
		}
	}

	const handleCenter = (waypoint: WaypointModel) => {
		setMapCenter({
			lat: waypoint.location?.latLng.latitude ?? MAP_CENTER.lat,
			lng: waypoint.location?.latLng.longitude ?? MAP_CENTER.lng,
		})

		setZoomLevel(16)

		setCenterOnPlace(true)
	}

	return (
		<Tabs defaultValue='manual' className='px-4 sm:px-0'>
			<TabsList>
				<TabsTrigger value='manual'>Manual</TabsTrigger>
				<TabsTrigger value='addresses'>Direcciones</TabsTrigger>
				<TabsTrigger value='places'>Lugares</TabsTrigger>
			</TabsList>
			<TabsContent value='manual'>
				<Autocomplete
					value={isMultipleSelection ? '' : manualWaypoints[0]?.address}
					onPlaceSelect={handlePlaceSelect}
					placeholder='Buscar una dirección o lugar'
					searchPlaceholder='Escribe una dirección o lugar'
				/>

				<Map
					className='mt-3 h-64 w-full'
					defaultCenter={MAP_CENTER}
					center={centerOnPlace ? mapCenter : undefined}
					zoom={zoomLevel}
					disableDefaultUI={true}
					fullscreenControl={isDesktop}
					onDragstart={() => setCenterOnPlace(false)}
					reuseMaps
					mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}>
					{manualWaypoints.map(
						waypoint =>
							waypoint.location && (
								<AdvancedMarker
									key={waypoint.placeId}
									position={{
										lat: waypoint.location.latLng.latitude as number,
										lng: waypoint.location.latLng.longitude as number,
									}}
								/>
							)
					)}
				</Map>

				{isMultipleSelection && (
					<WaypointSettingList className='mt-3'>
						{manualWaypoints.map(waypoint => (
							<WaypointSettingItem
								key={waypoint.placeId}
								waypoint={waypoint}
								className={cn(
									'cursor-pointer gap-2 rounded-md border p-2 transition-all',
									{
										'border-primary text-primary':
											waypoint.location?.latLng.latitude === mapCenter.lat &&
											waypoint.location.latLng.longitude === mapCenter.lng,
									}
								)}
								onClick={() => handleCenter(waypoint)}
							/>
						))}
					</WaypointSettingList>
				)}
			</TabsContent>
			<TabsContent value='addresses'>
				<ListBox>
					{favoriteAddresses.map(favoriteAddress => (
						<ListBoxItem
							key={favoriteAddress.id}
							isActive={
								waypointsSelected &&
								waypointsSelected.findIndex(
									waypoint => waypoint.placeId === favoriteAddress.placeId
								) > -1
							}
							onClick={() => handleSelectedFavoriteAddress(favoriteAddress)}>
							<MapPinned className='size-6 text-primary' />
							<p>
								<span>Alias:</span> {favoriteAddress.alias}
								<br />
								<span>Dirección:</span> {favoriteAddress.address}
							</p>
						</ListBoxItem>
					))}
				</ListBox>
			</TabsContent>
			<TabsContent value='places'>
				<ListBox>
					{favoritePlaces.map(favoritePlaces => (
						<ListBoxItem
							key={favoritePlaces.id}
							isActive={
								waypointsSelected &&
								waypointsSelected.findIndex(
									waypoint => waypoint.placeId === favoritePlaces.placeId
								) > -1
							}
							onClick={() => handleSelectedFavoritePlaces(favoritePlaces)}>
							<MapPinned className='size-6 text-primary' />
							<p>
								<span>Nombre:</span> {favoritePlaces.name}
								<br />
								<span>Dirección:</span> {favoritePlaces.address}
							</p>
						</ListBoxItem>
					))}
				</ListBox>
			</TabsContent>
		</Tabs>
	)
}

type WaypointSettingListProps = ComponentProps<'ul'> & {
	children:
		| ReactElement<WaypointSettingItemProps>[]
		| ReactElement<WaypointSettingItemProps>
}

const WaypointSettingList = ({
	children,
	className,
	...restProps
}: Readonly<WaypointSettingListProps>) => {
	const childrenItems = Children.toArray(
		children
	) as ReactElement<WaypointSettingItemProps>[]

	if (childrenItems.length <= 2) {
		return (
			<ul className={cn('mt-3 flex flex-col gap-2', className)} {...restProps}>
				{childrenItems.map((child, index) => {
					return cloneElement(child, {
						key: index,
						...child.props,
					})
				})}
			</ul>
		)
	}

	return (
		<Modal
			title='Puntos de interés'
			description='Detalle de los puntos de interés seleccionados'
			triggerIcon={<ListCollapse className='mr-1 size-4' />}
			triggerLabel={`${childrenItems.length} puntos de interés`}
			triggerProps={{
				variant: 'secondary',
				className: 'font-normal text-muted-foreground mt-3',
			}}
			isReadonly>
			<ul
				className={cn('flex flex-col gap-2 px-4 pb-3', className)}
				{...restProps}>
				{childrenItems.map((child, index) => {
					return cloneElement(child, {
						key: index,
						...child.props,
					})
				})}
			</ul>
		</Modal>
	)
}

type WaypointSettingItemProps = ComponentProps<'li'> & {
	onRemove?: (placeId: string) => void
	waypoint: WaypointModel
}

const WaypointSettingItem = ({
	waypoint,
	onRemove,
	className,
	...restProps
}: Readonly<WaypointSettingItemProps>) => {
	const { setWaypointsSelected: setWaypointSelected } = useWaypointSetting()

	const handleRemove = () => {
		if (waypoint.placeId) onRemove?.(waypoint.placeId)
		setWaypointSelected(prev => {
			if (!prev) return
			return prev.filter(selected => selected.placeId !== waypoint.placeId)
		})
	}

	return (
		<li
			className={cn(
				'grid grid-cols-[auto_1fr_auto] items-center gap-1 font-secondary text-sm text-muted-foreground',
				className
			)}
			{...restProps}>
			<LocateFixed className='mr-1 size-4' />
			<span>{waypoint.address}</span>
			<CircleMinus
				className='size-4 cursor-pointer text-destructive'
				onClick={handleRemove}
			/>
		</li>
	)
}

export {
	WaypointSetting,
	WaypointSettingItem,
	WaypointSettingList,
	WaypointSettingTabs,
}

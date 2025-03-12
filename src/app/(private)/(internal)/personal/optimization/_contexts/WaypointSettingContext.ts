import { createContext, Dispatch, SetStateAction } from 'react'
import { FavoriteAddressModel } from '../../favorite-addresses/_models'
import { FavoritePlaceModel } from '../../favorite-places/_models'
import { Waypoint } from '../_types'

export type WaypointSettingContextValue = {
	open: boolean
	setOpen: (open: boolean) => void
	waypointsSelected?: Waypoint[]
	setWaypointsSelected: Dispatch<SetStateAction<Waypoint[] | undefined>>
	favoritePlaces: FavoritePlaceModel[]
	favoriteAddresses: FavoriteAddressModel[]
	setFavoritePlaces: Dispatch<SetStateAction<FavoritePlaceModel[]>>
	setFavoriteAddresses: Dispatch<SetStateAction<FavoriteAddressModel[]>>
	isMultipleSelection: boolean
}

export const WaypointSettingContext =
	createContext<WaypointSettingContextValue>({
		open: false,
		setOpen: () => {},
		setWaypointsSelected: () => {},
		favoritePlaces: [],
		favoriteAddresses: [],
		setFavoritePlaces: () => {},
		setFavoriteAddresses: () => {},
		isMultipleSelection: false,
	})

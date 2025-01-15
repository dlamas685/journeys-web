import { createContext, Dispatch, SetStateAction } from 'react'
import { FavoriteAddressModel } from '../../favorite-addresses/_models'
import { FavoritePlaceModel } from '../../favorite-places/_models'
import { WaypointModel } from '../_models'

export type WaypointSettingContextValue = {
	open: boolean
	setOpen: (open: boolean) => void
	waypointsSelected?: WaypointModel[]
	setWaypointsSelected: Dispatch<SetStateAction<WaypointModel[] | undefined>>
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

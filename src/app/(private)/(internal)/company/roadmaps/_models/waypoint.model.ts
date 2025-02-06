import { LocationModel } from './location.model'

export interface WaypointModel {
	placeId: string
	address: string
	location: LocationModel
	sideOfRoad?: boolean
}

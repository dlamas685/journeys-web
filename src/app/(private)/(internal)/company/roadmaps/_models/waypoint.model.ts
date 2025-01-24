import { LocationModel } from './location.model'

export interface WaypointModel {
	location?: LocationModel

	placeId?: string

	sideOfRoad?: boolean
}

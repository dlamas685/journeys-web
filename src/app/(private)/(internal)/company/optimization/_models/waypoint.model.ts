import { LocationModel } from '@/common/models'

export interface WaypointModel {
	placeId: string
	address: string
	location: LocationModel
	sideOfRoad?: boolean
}

import { AdvancedWaypointActivityModel } from './advanced-waypoint-activity.model'
import { LocationModel } from './location.model'

export interface WaypointModel {
	placeId: string
	location: LocationModel
	address: string
	name?: string
	sideOfRoad?: boolean
	via?: boolean
	vehicleStopover?: boolean
}

export interface AdvancedWaypointModel extends WaypointModel {
	activities?: AdvancedWaypointActivityModel[]
	config?: AdvancedWaypointConfigModel
}

export interface AdvancedWaypointConfigModel {
	template?: string
	mode?: string
}

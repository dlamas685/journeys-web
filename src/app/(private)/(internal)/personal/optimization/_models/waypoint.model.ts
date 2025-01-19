import { WaypointActivityModel } from './waypoint-activity.model'

export interface WaypointModel {
	placeId: string
	location: google.maps.LatLngLiteral
	address: string
	name?: string
	sideOfRoad?: boolean
	via?: boolean
	vehicleStopover?: boolean
}

export interface AdvancedWaypointModel extends WaypointModel {
	activities?: WaypointActivityModel[]
	config?: WaypointConfigModel
}

export interface WaypointConfigModel {
	template?: string
	mode?: string
}

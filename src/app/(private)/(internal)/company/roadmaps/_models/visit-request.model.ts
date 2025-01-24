import { DurationModel } from './duration.model'
import { LatLngModel } from './lat-lng.model'
import { WaypointModel } from './waypoint.model'

export interface VisitRequestModel {
	arrivalLocation?: LatLngModel

	arrivalWaypoint?: WaypointModel

	departureLocation?: LatLngModel

	departureWaypoint?: WaypointModel

	duration: DurationModel
}

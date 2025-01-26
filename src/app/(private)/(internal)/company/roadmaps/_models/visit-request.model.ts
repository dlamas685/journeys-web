import { DurationModel, LatLngModel } from '@/common/models'
import { WaypointModel } from './waypoint.model'

export interface VisitRequestModel {
	arrivalLocation?: LatLngModel

	arrivalWaypoint?: WaypointModel

	departureLocation?: LatLngModel

	departureWaypoint?: WaypointModel

	duration: DurationModel
}

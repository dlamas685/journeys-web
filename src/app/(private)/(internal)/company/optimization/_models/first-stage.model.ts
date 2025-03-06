import { ModifiersModel } from './modifiers.model'
import { WaypointModel } from './waypoint.model'

export interface FirstStageModel {
	startWaypoint: WaypointModel
	endWaypoint: WaypointModel
	endDateTime: string
	startDateTime: string
	fleetId: string
	driverId: string
	vehicleId: string
	modifiers?: ModifiersModel
}

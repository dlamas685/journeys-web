import { type AdvancedWaypointActivityModel } from './advanced-waypoint-activity.model'
import { type AdvancedWaypointConfigModel } from './advanced-waypoint-config.model'
import { type WaypointModel } from './waypoint.model'

export interface AdvancedWaypointModel extends WaypointModel {
	activities?: AdvancedWaypointActivityModel[]
	config?: AdvancedWaypointConfigModel
}

import { type AdvancedWaypointActivity } from './advanced-waypoint-activity.type'
import { type AdvancedWaypointConfig } from './advanced-waypoint-config.type'
import { type Waypoint } from './waypoint.type'

export type AdvancedWaypoint = Waypoint & {
	activities?: AdvancedWaypointActivity[]
	config?: AdvancedWaypointConfig
}

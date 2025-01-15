import { RouteModifiersModel } from './routing-modifiers.model'
import { TimestampModel } from './timestamp.model'
import { WaypointModel } from './waypoint.model'

export interface BasicCriteriaModel {
	origin: Partial<WaypointModel>
	destination: Partial<WaypointModel>
	intermediates?: Partial<WaypointModel>[]
	travelMode: string
	departureTime?: TimestampModel
	routingPreference?: string
	routeModifiers?: RouteModifiersModel
}

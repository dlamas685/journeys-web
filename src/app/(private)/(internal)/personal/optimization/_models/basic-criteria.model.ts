import { RoutingPreference, TravelMode } from '../_enums'
import { RouteModifiersModel } from './routing-modifiers.model'
import { TimestampModel } from './timestamp.model'
import { WaypointModel } from './waypoint.model'

export interface BasicCriteriaModel {
	origin: WaypointModel
	destination: WaypointModel
	intermediates?: WaypointModel[]
	travelMode: TravelMode
	departureTime: TimestampModel
	routingPreference?: RoutingPreference
	routeModifiers?: RouteModifiersModel
}

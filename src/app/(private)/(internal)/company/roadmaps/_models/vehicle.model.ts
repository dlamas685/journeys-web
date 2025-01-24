import { TravelMode } from '../_enums'
import { LatLngModel } from './lat-lng.model'
import { RouteModifiersModel } from './route-modifiers.model'
import { WaypointModel } from './waypoint.model'

export interface VehicleModel {
	displayName?: string

	startLocation?: LatLngModel

	startWaypoint?: WaypointModel

	endLocation?: LatLngModel

	endWaypoint?: WaypointModel

	fixedCost?: number

	costPerHour?: number

	costPerKilometer?: number

	costPerTraveledHour?: number

	travelMode?: TravelMode

	travelDurationMultiple?: number

	routeModifiers?: RouteModifiersModel
}

import { LatLngModel } from '@/common/models'
import { TravelMode } from '../_enums'
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

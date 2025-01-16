import { DepartureModel } from './departure.model'
import { RouteModifiersModel } from './routing-modifiers.model'
import { WaypointModel } from './waypoint.model'

export interface BasicCriteriaModel {
	origin: Partial<WaypointModel>
	destination: Partial<WaypointModel>
	intermediates?: Partial<WaypointModel>[]
	travelMode: string
	departure: DepartureModel
	routingPreference?: string
	routeModifiers?: RouteModifiersModel
}

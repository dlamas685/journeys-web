import { TrafficOption, TravelMode } from '../_enums'
import { ModifiersModel } from './modifiers.model'
import { WaypointModel } from './waypoint.model'

export interface BasicCriteriaModel {
	origin: WaypointModel
	destination: WaypointModel
	departureTime: string
	interestPoints?: WaypointModel[]
	travelMode: TravelMode
	trafficOption?: TrafficOption
	modifiers?: ModifiersModel
}

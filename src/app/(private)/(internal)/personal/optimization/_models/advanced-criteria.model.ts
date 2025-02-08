import {
	ExtraComputation,
	ReferenceRoute,
	TrafficModel,
	VehicleEmissionType,
} from '../_enums'
import { type AdvancedWaypointModel } from './advanced-waypoint.model'

export interface AdvancedCriteriaModel {
	interestPoints?: AdvancedWaypointModel[]
	extraComputations?: ExtraComputation[]
	requestedReferenceRoutes?: ReferenceRoute[]
	trafficModel?: TrafficModel
	computeAlternativeRoutes?: boolean
	optimizeWaypointOrder?: boolean
	emissionType?: VehicleEmissionType
}

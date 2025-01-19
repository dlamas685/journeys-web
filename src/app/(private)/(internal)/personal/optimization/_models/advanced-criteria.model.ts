import { ExtraComputation, ReferenceRoute, TrafficModel } from '../_enums'
import { type BasicCriteriaModel } from './basic-criteria.model'
import { AdvancedWaypointModel } from './waypoint.model'

export interface AdvancedCriteriaModel
	extends Omit<BasicCriteriaModel, 'intermediates'> {
	extraComputations?: ExtraComputation[]
	requestedReferenceRoutes?: ReferenceRoute[]
	trafficModel?: TrafficModel
	computeAlternativeRoutes?: boolean
	optimizeWaypointOrder?: boolean
	intermediates?: Partial<AdvancedWaypointModel>[]
}

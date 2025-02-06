import { MetricsModel } from './metrics.model'
import { TransitionModel } from './transition.model'
import { VisitModel } from './visit.model'

export interface RoadmapOptimizationModel {
	visits: VisitModel[]
	transitions: TransitionModel[]
	metrics: MetricsModel
	label: string
	startDateTime: Date
	endDateTime: Date
	encodedPolyline: string
	skipped: string[]
}

import type { CriteriaModel, RouteModel } from '../../optimization/_models'
import { TripStatus } from '../_enums/trip-status.enum'

export interface TripModel {
	id: string
	userId: string
	tripStatus: TripStatus
	code: string
	origin: string
	destination: string
	departureTime: Date
	arrivalTime: Date | null
	totalDistance: number | null
	totalDuration: number | null
	criteria: CriteriaModel
	results?: RouteModel[]
	createdAt: Date
	updatedAt: Date
}

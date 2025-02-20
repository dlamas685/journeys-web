import type { CriteriaModel, RouteModel } from '../../optimization/_models'

export interface TripModel {
	id: string
	userId: string
	code: string
	origin: string
	destination: string
	isArchived: boolean
	departureTime: Date
	arrivalTime: Date | null
	totalDistance: number | null
	totalDuration: number | null

	criteria: CriteriaModel
	results?: RouteModel[]

	createdAt: Date
	updatedAt: Date | null
}

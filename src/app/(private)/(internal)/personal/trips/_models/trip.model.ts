import type { CriteriaModel, RouteModel } from '../../optimization/_models'

export interface TripModel {
	id: string
	userId: string
	code: string
	isArchived: boolean
	departureTime: Date
	criteria: CriteriaModel
	results: RouteModel[]

	createdAt: Date
	updatedAt: Date | null
}

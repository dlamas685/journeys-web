import { CriteriaModel, RouteModel } from '../../optimization/_models'

export interface TripModel {
	id: string
	userId: string
	tripStatus: string
	code: string
	origin: string
	destination: string
	departureTime: Date
	criteria: CriteriaModel
	results: RouteModel[]
	createdAt: Date
	updatedAt: Date
}

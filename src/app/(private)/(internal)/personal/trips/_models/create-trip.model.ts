import { CriteriaModel, RouteModel } from '../../optimization/_models'

export interface CreateTripModel {
	code: string
	origin: string
	destination: string
	departureTime: string
	criteria: CriteriaModel
	results: RouteModel[]
}

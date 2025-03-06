import { CriteriaModel } from '../../optimization/_models'

export interface CreateTripModel {
	code: string
	departureTime: string
	criteria: CriteriaModel
}

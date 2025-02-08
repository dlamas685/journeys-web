import { type AdvancedCriteriaModel } from './advanced-criteria.model'
import { type BasicCriteriaModel } from './basic-criteria.model'

export interface CriteriaModel {
	basicCriteria: BasicCriteriaModel
	advancedCriteria?: AdvancedCriteriaModel
}

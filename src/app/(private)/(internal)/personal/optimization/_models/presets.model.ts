import { AdvancedCriteriaModel } from './advanced-criteria.model'
import { type BasicCriteriaModel } from './basic-criteria.model'

export interface PresetsModel {
	basic: BasicCriteriaModel
	advanced?: AdvancedCriteriaModel
}

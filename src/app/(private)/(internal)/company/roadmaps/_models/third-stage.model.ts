import { CostProfile } from '../_enums'
import { BoundsModel } from './bounds.model'
import { type CostModelModel } from './cost-model.model'

export interface ThirdStageModel {
	costProfile: CostProfile
	costModel?: CostModelModel
	bounds?: BoundsModel
}

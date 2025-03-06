import { type FirstStageModel } from './first-stage.model'
import { type SecondStageModel } from './second-stage.model'
import { type ThirdStageModel } from './third-stage.model'

export interface SettingModel {
	firstStage: FirstStageModel
	secondStage: SecondStageModel
	thirdStage?: ThirdStageModel
}

import {
	type FirstStageFormSchema,
	type SecondStageFormSchema,
	type ThirdStageFormSchema,
} from '../_schemas'

export interface PresetsModel {
	firstStage: FirstStageFormSchema
	secondStage: SecondStageFormSchema
	thirdStage?: ThirdStageFormSchema
}

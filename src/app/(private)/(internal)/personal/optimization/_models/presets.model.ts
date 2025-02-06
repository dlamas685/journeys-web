import {
	type AdvancedOptimizationFormSchema,
	type BasicOptimizationFormSchema,
} from '../_schemas'

export interface PresetsModel {
	basic: BasicOptimizationFormSchema
	advanced?: AdvancedOptimizationFormSchema
}

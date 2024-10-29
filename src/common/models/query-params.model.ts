import {
	FilterRules,
	FilterTypes,
	LogicalOperators,
	SortDirections,
} from '../enums'

export interface QueryParamsModel {
	page?: number
	limit?: number
	filters?: FilterFieldModel[]
	sorts?: SortFieldModel[]
	logicalFilters?: LogicalFilterModel[]
}

export interface FilterFieldModel {
	field: string
	rule: FilterRules
	type?: FilterTypes
	value?: any
}

export interface SortFieldModel {
	field: string
	direction: SortDirections
}

export interface LogicalFilterModel {
	operator: LogicalOperators
	conditions: FilterFieldModel[]
}

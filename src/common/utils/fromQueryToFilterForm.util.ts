import type { FilterFieldModel } from '../models'

export const fromQueryToFilterForm = <T>(filters?: FilterFieldModel[]) => {
	const filtersForm = filters?.reduce((acc, filter) => {
		return {
			...acc,
			[filter.field]: {
				field: filter.field,
				type: filter.type,
				rule: filter.rule,
				value: filter.value,
			},
		}
	}, {})

	return filtersForm as T
}

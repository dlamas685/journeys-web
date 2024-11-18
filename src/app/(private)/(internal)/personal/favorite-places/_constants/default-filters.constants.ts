import { FilterRules } from '@/common/enums'
import { FilterFormSchema } from '../_schemas/filter-form.schema'

export const DEFAULT_VALUES: FilterFormSchema = {
	name: {
		field: 'name',
		rule: FilterRules.CONTAINS,
		type: 'string',
	},
	address: {
		field: 'address',
		type: 'string',
		rule: FilterRules.CONTAINS,
	},
}

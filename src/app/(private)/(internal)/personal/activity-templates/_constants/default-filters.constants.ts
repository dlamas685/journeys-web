import { FilterTypes } from '@/common/enums'
import { type FilterFormSchema } from '../_schemas'

export const DEFAULT_VALUES: FilterFormSchema = {
	name: {
		field: 'name',
		type: FilterTypes.STRING,
	},
	description: {
		field: 'description',
		type: FilterTypes.STRING,
	},
}

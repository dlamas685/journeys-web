import { FilterTypes } from '@/common/enums'
import { type FilterFormSchema } from '../_schemas'

export const DEFAULT_VALUES: FilterFormSchema = {
	alias: {
		field: 'code',
		type: FilterTypes.STRING,
	},
	isArchived: {
		field: 'isArchived',
		type: FilterTypes.BOOLEAN,
	},
	departureTime: {
		field: 'departureTime',
		type: FilterTypes.DATE,
	},
	createdAt: {
		field: 'createdAt',
		type: FilterTypes.DATE,
	},
}

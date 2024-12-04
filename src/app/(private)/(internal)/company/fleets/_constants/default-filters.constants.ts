import { FilterTypes } from '@/common/enums'
import { FilterFormSchema } from '../_schemas/filter-form.schema'

export const DEFAULT_VALUES: FilterFormSchema = {
	name: {
		field: 'name',
		type: FilterTypes.STRING,
	},
	description: {
		field: 'description',
		type: FilterTypes.STRING,
	},
	maxDrivers: {
		field: 'maxDrivers',
		type: FilterTypes.NUMBER,
	},
	maxVehicles: {
		field: 'maxVehicles',
		type: FilterTypes.NUMBER,
	},
	createdAt: {
		field: 'createdAt',
		type: FilterTypes.DATE,
	},
}

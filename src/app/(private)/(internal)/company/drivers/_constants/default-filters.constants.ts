import { FilterTypes } from '@/common/enums'
import { FilterFormSchema } from '../_schemas/filter-form.schema'

export const DEFAULT_VALUES: FilterFormSchema = {
	name: {
		field: 'name',
		type: FilterTypes.STRING,
	},
	fleetId: {
		field: 'fleetId',
		type: FilterTypes.UUID,
	},
	licenseNumber: {
		field: 'licenseNumber',
		type: FilterTypes.STRING,
	},
	createdAt: {
		field: 'createdAt',
		type: FilterTypes.DATE,
	},
}

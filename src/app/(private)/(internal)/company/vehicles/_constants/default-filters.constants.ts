import { FilterTypes } from '@/common/enums'
import { FilterFormSchema } from '../_schemas/filter-form.schema'

export const DEFAULT_VALUES: FilterFormSchema = {
	fleetId: {
		field: 'fleetId',
		type: FilterTypes.UUID,
	},
	licensePlate: {
		field: 'licensePlate',
		type: FilterTypes.STRING,
	},
	make: {
		field: 'make',
		type: FilterTypes.STRING,
	},
	model: {
		field: 'model',
		type: FilterTypes.STRING,
	},
	year: {
		field: 'year',
		type: FilterTypes.NUMBER,
	},
	vin: {
		field: 'vin',
		type: FilterTypes.STRING,
	},
	createdAt: {
		field: 'createdAt',
		type: FilterTypes.DATE,
	},
}

import { FilterTypes } from '@/common/enums'
import { FilterFormSchema } from '../_schemas/filter-form.schema'

export const DEFAULT_VALUES: FilterFormSchema = {
	alias: {
		field: 'code',
		type: FilterTypes.STRING,
	},
	date: {
		field: 'startDateTime',
		type: FilterTypes.DATE,
	},
	status: {
		field: 'status',
		type: FilterTypes.ENUM,
	},
	fleetId: {
		field: 'fleetId',
		type: FilterTypes.UUID,
	},
	driverId: {
		field: 'driverId',
		type: FilterTypes.UUID,
	},
	vehicleId: {
		field: 'vehicleId',
		type: FilterTypes.UUID,
	},
	createdAt: {
		field: 'createdAt',
		type: FilterTypes.DATE,
	},
}

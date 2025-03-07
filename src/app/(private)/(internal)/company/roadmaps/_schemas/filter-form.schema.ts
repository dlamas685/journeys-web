import { FilterRules } from '@/common/enums'
import {
	dateFilterSchema,
	enumFilterSchema,
	textFilterSchema,
	uuidFilterSchema,
} from '@/common/schemas'
import { z } from 'zod'
import { RoadmapStatus } from '../_enums/roadmap-status.enum'

const textRules = [
	FilterRules.CONTAINS,
	FilterRules.ENDS_WITH,
	FilterRules.EQUALS,
	FilterRules.LIKE,
	FilterRules.STARTS_WITH,
] as [string, ...string[]]

const enumRules = [FilterRules.NOT_EQUALS, FilterRules.EQUALS] as [
	string,
	...string[],
]

const dateRules = [
	FilterRules.EQUALS,
	FilterRules.GREATER_THAN,
	FilterRules.GREATER_THAN_OR_EQUALS,
	FilterRules.LESS_THAN,
	FilterRules.LESS_THAN_OR_EQUALS,
] as [string, ...string[]]

const uuidRules = [FilterRules.EQUALS, FilterRules.NOT_EQUALS] as [
	string,
	...string[],
]

export const filterFormSchema = z.object({
	alias: textFilterSchema(textRules),
	date: dateFilterSchema(dateRules),
	status: enumFilterSchema(enumRules, RoadmapStatus),
	fleetId: uuidFilterSchema(uuidRules),
	vehicleId: uuidFilterSchema(uuidRules),
	driverId: uuidFilterSchema(uuidRules),
	createdAt: dateFilterSchema(dateRules),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>

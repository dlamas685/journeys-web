import { FilterRules } from '@/common/enums'
import {
	dateFilterSchema,
	textFilterSchema,
	uuidFilterSchema,
} from '@/common/schemas'
import { z } from 'zod'

const textRules = [
	FilterRules.CONTAINS,
	FilterRules.ENDS_WITH,
	FilterRules.EQUALS,
	FilterRules.LIKE,
	FilterRules.STARTS_WITH,
] as [string, ...string[]]

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
	name: textFilterSchema(textRules),
	licenseNumber: textFilterSchema(textRules),
	fleetId: uuidFilterSchema(uuidRules),
	createdAt: dateFilterSchema(dateRules),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>

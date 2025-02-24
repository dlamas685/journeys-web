import { FilterRules } from '@/common/enums'
import {
	booleanFilterSchema,
	dateFilterSchema,
	textFilterSchema,
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

const booleanRules = [FilterRules.EQUALS, FilterRules.NOT_EQUALS] as [
	string,
	...string[],
]

export const filterFormSchema = z.object({
	alias: textFilterSchema(textRules),
	isArchived: booleanFilterSchema(booleanRules),
	departureTime: dateFilterSchema(dateRules),
	createdAt: dateFilterSchema(dateRules),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>

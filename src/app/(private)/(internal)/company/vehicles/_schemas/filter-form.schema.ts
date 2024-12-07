import { FilterRules } from '@/common/enums'
import {
	dateFilterSchema,
	numberFilterSchema,
	textFilterSchema,
	uuidFilterSchema,
} from '@/common/schemas'
import { z } from 'zod'

const fleetRules = [FilterRules.EQUALS] as [string, ...string[]]

const textRules = [
	FilterRules.CONTAINS,
	FilterRules.ENDS_WITH,
	FilterRules.EQUALS,
	FilterRules.LIKE,
	FilterRules.STARTS_WITH,
] as [string, ...string[]]

const numberRules = [
	FilterRules.EQUALS,
	FilterRules.GREATER_THAN,
	FilterRules.GREATER_THAN_OR_EQUALS,
	FilterRules.LESS_THAN,
	FilterRules.LESS_THAN_OR_EQUALS,
] as [string, ...string[]]

const fleetIdRules = [FilterRules.EQUALS, FilterRules.NOT_EQUALS] as [
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

export const filterFormSchema = z.object({
	fleetId: uuidFilterSchema(fleetIdRules),
	licensePlate: textFilterSchema(textRules),
	make: textFilterSchema(textRules),
	model: textFilterSchema(textRules),
	year: numberFilterSchema(numberRules),
	vin: textFilterSchema(textRules),
	createdAt: dateFilterSchema(dateRules),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>

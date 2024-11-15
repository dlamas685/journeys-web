import { FilterRules } from '@/common/enums'
import { searchFilterSchema, textFilterSchema } from '@/common/schemas'
import { z } from 'zod'

const aliasRules = [
	FilterRules.CONTAINS,
	FilterRules.ENDS_WITH,
	FilterRules.EQUALS,
	FilterRules.LIKE,
	FilterRules.STARTS_WITH,
] as [string, ...string[]]

export const filterFormSchema = z.object({
	alias: textFilterSchema(aliasRules),
	address: searchFilterSchema(),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>

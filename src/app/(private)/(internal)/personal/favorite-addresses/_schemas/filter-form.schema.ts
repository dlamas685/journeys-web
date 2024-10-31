import { FilterRules } from '@/common/enums'
import { textFilterSchema } from '@/common/schemas/text-filter.schema'
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
	address: textFilterSchema(aliasRules),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>

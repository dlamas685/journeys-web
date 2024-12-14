import { FilterRules } from '@/common/enums'
import { textFilterSchema } from '@/common/schemas'
import { z } from 'zod'

const textRules = [
	FilterRules.CONTAINS,
	FilterRules.ENDS_WITH,
	FilterRules.EQUALS,
	FilterRules.LIKE,
	FilterRules.STARTS_WITH,
] as [string, ...string[]]

export const filterFormSchema = z.object({
	name: textFilterSchema(textRules),
	description: textFilterSchema(textRules),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>

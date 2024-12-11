import { z } from 'zod'
import { FilterRules } from '../enums'

export const searchFilterSchema = (valueMessage?: string) =>
	z.object({
		field: z.string(),
		type: z.string(),
		rule: z.enum([FilterRules.CONTAINS]),
		value: z
			.string({
				message: valueMessage,
			})
			.optional(),
	})

export type SearchFilterSchema = z.infer<ReturnType<typeof searchFilterSchema>>

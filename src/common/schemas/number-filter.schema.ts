import { z } from 'zod'

export const numberFilterSchema = (
	fields: [string, ...string[]],
	rules: [string, ...string[]],
	types: [string, ...string[]],
	ruleMessage?: string,
	valueMessage?: string
) =>
	z.object({
		field: z.enum(fields),
		type: z.enum(types),
		rule: z.enum(rules, {
			message: ruleMessage,
		}),
		value: z
			.number({
				message: valueMessage,
			})
			.nullable(),
	})

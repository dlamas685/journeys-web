import { z } from 'zod'

export const textFilterSchema = (
	rules: [string, ...string[]],
	ruleMessage?: string,
	valueMessage?: string
) =>
	z
		.object({
			field: z.string(),
			type: z.string(),
			rule: z
				.enum(rules, {
					message: ruleMessage,
				})
				.optional(),
			value: z.string().optional(),
		})
		.refine(data => !data.rule || (data.rule && data.value), {
			message: 'Debes ingresar un valor.',
			path: ['value'],
		})
		.refine(data => !data.value || (data.value && data.rule), {
			message: 'Debes seleccionar una regla.',
			path: ['rule'],
		})

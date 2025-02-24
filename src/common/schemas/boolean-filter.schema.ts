import { z } from 'zod'

export const booleanFilterSchema = (
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
			value: z
				.boolean({
					message: valueMessage,
				})
				.nullish(),
		})
		.refine(data => !(data.rule && data.value == null), {
			message: 'Debes ingresar un valor.',
			path: ['value'],
		})
		.refine(data => !(data.value !== undefined && !data.rule), {
			message: 'Debes seleccionar una regla.',
			path: ['rule'],
		})

export type BooleanFilterSchema = z.infer<
	ReturnType<typeof booleanFilterSchema>
>

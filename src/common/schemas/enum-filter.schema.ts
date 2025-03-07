import { EnumLike, z } from 'zod'

export const enumFilterSchema = <T extends EnumLike>(
	rules: [string, ...string[]],
	values: T,
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
			value: z.nativeEnum(values, { message: valueMessage }).optional(),
		})
		.refine(data => !data.rule || (data.rule && data.value), {
			message: 'Debes ingresar un valor.',
			path: ['value'],
		})
		.refine(data => !data.value || (data.value && data.rule), {
			message: 'Debes seleccionar una regla.',
			path: ['rule'],
		})

export type EnumFilterSchema = z.infer<ReturnType<typeof enumFilterSchema>>

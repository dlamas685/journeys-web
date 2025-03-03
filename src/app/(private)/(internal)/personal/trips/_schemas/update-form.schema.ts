import { z } from 'zod'

export const updateFormSchema = z.object({
	id: z.string(),
	alias: z
		.string({
			required_error: 'El alias es requerido',
		})
		.min(3, 'El alias debe tener al menos 3 caracteres')
		.max(100, 'El alias no puede superar los 100 caracteres'),
})

export type UpdateFormSchema = z.infer<typeof updateFormSchema>

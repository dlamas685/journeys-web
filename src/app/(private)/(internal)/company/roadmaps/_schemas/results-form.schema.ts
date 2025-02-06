import { z } from 'zod'

export const resultsFormSchema = z.object({
	alias: z
		.string({
			required_error: 'El alias es requerido',
		})
		.max(100, 'El alias no puede superar los 100 caracteres'),
})

export type ResultsFormSchema = z.infer<typeof resultsFormSchema>

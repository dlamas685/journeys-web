import { z } from 'zod'

export const resultsOptimizationFormSchema = z.object({
	alias: z
		.string({
			required_error: 'El alias es requerido',
		})
		.min(3, 'El alias debe tener al menos 3 carácter')
		.max(100, 'El alias no puede superar los 100 caracteres'),
})

export type ResultsOptimizationFormSchema = z.infer<
	typeof resultsOptimizationFormSchema
>

import { z } from 'zod'

export const upsertFormSchema = z.object({
	id: z.string().optional(),
	name: z
		.string({
			message: 'El nombre es requerido',
		})
		.min(1, 'El nombre es requerido')
		.max(50, 'El nombre no puede tener más de 50 caracteres'),
	description: z
		.string({
			message: 'La descripción es requerida',
		})
		.min(1, 'La descripción es requerida')
		.max(300, 'La descripción no puede superar los 300 caracteres'),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>

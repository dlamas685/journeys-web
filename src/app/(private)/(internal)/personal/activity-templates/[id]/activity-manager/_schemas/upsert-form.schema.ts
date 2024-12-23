import { z } from 'zod'

export const upsertFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'El nombre es requerido')
		.max(50, 'El nombre no puede superar los 50 caracteres'),
	description: z
		.string()
		.trim()
		.min(1, 'La descripción es requerida')
		.max(300, 'La descripción no puede superar los 300 caracteres'),
	duration: z
		.number()
		.int('La duración debe ser un número entero')
		.min(30, 'La duración mínima es de 30 minutos')
		.max(480, 'La duración máxima es de 480 minutos')
		.optional(),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>

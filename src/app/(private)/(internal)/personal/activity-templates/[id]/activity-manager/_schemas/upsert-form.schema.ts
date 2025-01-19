import { TIME } from '@/common/constants'
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
		.string()
		.regex(TIME, {
			message:
				'El formato debe ser HH:mm, donde HH son horas y mm son minutos.',
		})
		.optional(),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>

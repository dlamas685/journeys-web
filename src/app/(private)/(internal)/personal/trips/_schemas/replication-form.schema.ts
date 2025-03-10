import { TIME } from '@/common/constants'
import { z } from 'zod'

export const replicationFormSchema = z.object({
	id: z.string(),
	alias: z
		.string({
			required_error: 'El alias es requerido',
		})
		.min(3, 'El alias debe tener al menos 3 caracteres')
		.max(100, 'El alias no puede superar los 100 caracteres'),

	departureConfig: z.enum(['schedule', 'current'], {
		required_error: 'El tipo de salida es requerido',
	}),

	departure: z
		.object({
			date: z
				.string({
					required_error: 'La fecha de salida es requerida',
				})
				.date('La fecha de salida no es válida'),
			time: z
				.string({
					required_error: 'La hora de salida es requerida',
				})
				.regex(TIME, {
					message: 'La hora de salida no es válida',
				}),
		})
		.optional(),
})

export type ReplicationFormSchema = z.infer<typeof replicationFormSchema>

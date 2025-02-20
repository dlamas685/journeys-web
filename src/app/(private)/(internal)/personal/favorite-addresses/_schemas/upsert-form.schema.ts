import { z } from 'zod'

export const upsertFormSchema = z.object({
	id: z.string().optional(),
	alias: z
		.string({
			message: 'El alias es requerido',
		})
		.min(1, 'El alias es requerido')
		.max(50, 'El alias no puede tener más de 50 caracteres'),
	address: z
		.string({
			message: 'La dirección es requerida',
		})
		.min(1, 'La dirección es requerida'),
	location: z.object({ latitude: z.number(), longitude: z.number() }),
	placeId: z.string(),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>

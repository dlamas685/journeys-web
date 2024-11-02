import { z } from 'zod'

export const creatorFormSchema = z.object({
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
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	placeId: z.string().optional(),
})

export type CreatorFormSchema = z.infer<typeof creatorFormSchema>

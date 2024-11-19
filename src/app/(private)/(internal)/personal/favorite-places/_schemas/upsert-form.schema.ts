import { z } from 'zod'

export const upsertFormSchema = z.object({
	id: z.string().optional(),
	name: z
		.string({
			message: 'El lugar es requerido',
		})
		.min(1, 'El lugar es requerido'),
	latitude: z.number(),
	longitude: z.number(),
	placeId: z.string(),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>

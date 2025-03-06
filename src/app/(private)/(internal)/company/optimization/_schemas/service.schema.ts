import { TIME } from '@/common/constants'
import { z } from 'zod'

export const serviceSchema = z.object({
	id: z.string().uuid(),
	name: z.string().trim(),
	description: z.string().trim(),
	duration: z
		.string({
			message: 'La duración es requerida',
		})
		.regex(TIME, {
			message: 'El formato debe ser HH:MM',
		}),
	waypoint: z.object(
		{
			placeId: z.string(),
			address: z.string(),
			location: z.object({
				latitude: z.number(),
				longitude: z.number(),
			}),
			sideOfRoad: z.boolean().default(true).optional(),
		},
		{
			required_error: 'Tiene que especificar una dirección',
		}
	),
})

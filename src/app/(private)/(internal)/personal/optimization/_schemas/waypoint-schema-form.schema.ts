import { z } from 'zod'
import { upsertFormSchema as activityFormSchema } from '../../activity-templates/[id]/activity-manager/_schemas/upsert-form.schema'

export const waypointSchema = (required_error?: string) =>
	z.object(
		{
			placeId: z.string({
				required_error: 'El lugar es requerido',
			}),
			address: z.string({
				required_error: 'La dirección es requerida',
			}),
			location: z.object(
				{
					latitude: z.number(),
					longitude: z.number(),
				},
				{
					required_error: 'La ubicación es requerida',
				}
			),
			sideOfRoad: z.boolean().optional(),
			via: z.boolean().optional(),
			vehicleStopover: z.boolean().optional(),
			activities: z
				.array(
					z.object({
						id: z.string().uuid(),
						...activityFormSchema.required().shape,
					})
				)
				.min(0)
				.optional(),
			config: z
				.object({
					template: z.string().optional(),
					mode: z.string().optional(),
				})
				.optional(),
		},
		{
			required_error,
		}
	)

export type WaypointSchema = z.infer<ReturnType<typeof waypointSchema>>

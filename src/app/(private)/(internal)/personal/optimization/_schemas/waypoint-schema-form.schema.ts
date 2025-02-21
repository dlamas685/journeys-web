import { z } from 'zod'

export const waypointSchema = (required_error?: string) =>
	z.object(
		{
			placeId: z.string({
				required_error: 'El lugar es requerido',
			}),
			address: z.string({
				required_error: 'La dirección es requerida',
			}),
			name: z.string(),
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
		},
		{
			required_error,
		}
	)

export type WaypointSchema = z.infer<ReturnType<typeof waypointSchema>>

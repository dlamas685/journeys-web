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
			location: z.object(
				{
					lat: z.number(),
					lng: z.number(),
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

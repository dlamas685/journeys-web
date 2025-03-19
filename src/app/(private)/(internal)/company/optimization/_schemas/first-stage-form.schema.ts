import { TIME } from '@/common/constants'
import { z } from 'zod'

export const firstStageFormSchema = z.object({
	startWaypoint: z.object(
		{
			placeId: z.string(),
			address: z.string(),
			location: z.object({
				latitude: z.number(),
				longitude: z.number(),
			}),
		},
		{
			required_error: 'La ubicación inicial es requerida',
		}
	),
	endWaypoint: z.object(
		{
			placeId: z.string(),
			address: z.string(),
			location: z.object({
				latitude: z.number(),
				longitude: z.number(),
			}),
		},
		{
			required_error: 'La ubicación final es requerida',
		}
	),
	global: z
		.object({
			date: z
				.string({
					required_error: 'La fecha de inicio es requerida',
				})
				.date('La fecha no tiene un formato adecuado'),
			startTime: z
				.string({
					required_error: 'La hora de inicio es requerida',
				})
				.regex(TIME, {
					message: 'La hora no tiene un formato adecuado (HH:mm)',
				}),
			endTime: z
				.string({
					required_error: 'La hora de fin es requerida',
				})
				.regex(TIME, {
					message: 'La hora no tiene un formato adecuado (HH:mm)',
				}),
		})
		.refine(
			data => {
				const startTime = new Date(
					`${data.date}T${data.startTime}:00`
				).getTime()

				const endTime = new Date(`${data.date}T${data.endTime}:00`).getTime()

				return startTime < endTime
			},
			{
				path: ['endTime'],
				message: 'La hora de fin debe ser mayor a la hora de inicio',
			}
		),

	fleetId: z
		.string({
			required_error: 'La flota es requerida',
		})
		.uuid({
			message: 'La flota es requerida',
		}),

	driverId: z
		.string({
			required_error: 'El conductor es requerido',
		})
		.uuid({
			message: 'El conductor es requerido',
		}),

	vehicleId: z
		.string({
			required_error: 'El vehículo es requerido',
		})
		.uuid({
			message: 'El vehículo es requerido',
		}),

	modifiers: z
		.object({
			avoidTolls: z.boolean().optional(),
			avoidHighways: z.boolean().optional(),
			avoidFerries: z.boolean().optional(),
			considerRoadTraffic: z.boolean().optional(),
		})
		.optional(),
})

export type FirstStageFormSchema = z.infer<typeof firstStageFormSchema>

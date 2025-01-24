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
	global: z.object({
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
	}),
	fixedCost: z.number().positive().optional(),
	costPerKilometer: z.number().positive().optional(),
	costPerHour: z.number().positive().optional(),
	costPerTraveledHour: z.number().positive().optional(),
	travelDurationMultiple: z.array(z.number()).optional(),
	routeModifiers: z
		.object({
			avoidTolls: z.boolean().optional(),
			avoidHighways: z.boolean().optional(),
			avoidFerries: z.boolean().optional(),
		})
		.optional(),
})

export type FirstStageFormSchema = z.infer<typeof firstStageFormSchema>

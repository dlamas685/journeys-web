import { TIME } from '@/common/constants'
import { hhmmToSeconds } from '@/common/utils'
import { z } from 'zod'
import { CostProfile } from '../_enums'

export const thirdStageFormSchema = z.object({
	costProfile: z.nativeEnum(CostProfile),
	costModel: z
		.object({
			fixedCost: z.number().positive().optional(),
			costPerKilometer: z.number().positive().optional(),
			costPerHour: z.number().positive().optional(),
			costPerTraveledHour: z.number().positive().optional(),
			travelDurationMultiple: z.array(z.number()).optional(),
		})
		.optional(),
	bounds: z
		.object({
			routeDurationLimit: z
				.string()
				.regex(TIME, { message: 'El formato debe ser HH:MM' })
				.optional(),
			travelDurationLimit: z
				.string()
				.regex(TIME, { message: 'El formato debe ser HH:MM' })
				.optional(),
			routeDistanceLimit: z
				.number()
				.min(5000, 'La distancia mínima es 5000 m')
				.max(5000000, 'La distancia máxima es 5000000 m')
				.optional(),
		})
		.optional()
		.refine(
			data => {
				if (!data || !data.routeDurationLimit) return true
				const durationInSeconds = hhmmToSeconds(data.routeDurationLimit)
				return durationInSeconds >= 14400 && durationInSeconds <= 28800
			},
			{
				message: 'La duración total no puede ser menor a 4 hs ni mayor a 8 hs',
				path: ['routeDurationLimit'],
			}
		)
		.refine(
			data => {
				if (!data || !data.travelDurationLimit) return true
				const durationInSeconds = hhmmToSeconds(data.travelDurationLimit)
				return durationInSeconds >= 1800 && durationInSeconds <= 14400
			},
			{
				message:
					'La duración de tránsito no puede ser menor a 30 min ni mayor a 4 hs',
				path: ['travelDurationLimit'],
			}
		),
})

export type ThirdStageFormSchema = z.infer<typeof thirdStageFormSchema>

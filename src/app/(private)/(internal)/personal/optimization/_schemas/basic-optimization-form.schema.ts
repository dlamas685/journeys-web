import { z } from 'zod'
import { RoutingPreference } from '../_enums'
import { TravelMode } from '../_enums/travel-mode.enum'
import { waypointSchema } from './waypoint-schema-form.schema'

const travelModes = Object.values(TravelMode) as [string, ...string[]]

const routingPreferences = Object.values(RoutingPreference) as [
	string,
	...string[],
]

export const basicOptimizationFormSchema = z
	.object({
		origin: waypointSchema('El origen es requerido'),
		destination: waypointSchema('El destino es requerido'),
		intermediates: z
			.array(waypointSchema())
			.min(0)
			.max(5, {
				message: 'El máximo de puntos intermedios es 5',
			})
			.optional(),
		travelMode: z.enum(travelModes).default(TravelMode.DRIVE),
		departure: z.object({
			date: z.date({
				required_error: 'La fecha de salida es requerida',
			}),
			time: z
				.string({
					required_error: 'La hora de salida es requerida',
				})
				.regex(/^\d{2}:\d{2}$/, 'Formato inválido (HH:mm)'),
		}),

		routingPreference: z.enum(routingPreferences).optional(),
		routeModifiers: z
			.object({
				avoidTolls: z.boolean().default(false),
				avoidHighways: z.boolean().default(false),
				avoidFerries: z.boolean().default(false),
			})
			.default({ avoidTolls: false, avoidHighways: false, avoidFerries: false })
			.optional(),
	})
	.refine(
		data =>
			data.origin !== undefined &&
			data.destination !== undefined &&
			data.origin.placeId !== data.destination.placeId,
		{
			message: 'El destino no puede ser igual al origen',
			path: ['destination'],
		}
	)

export type BasicOptimizationFormSchema = z.infer<
	typeof basicOptimizationFormSchema
>

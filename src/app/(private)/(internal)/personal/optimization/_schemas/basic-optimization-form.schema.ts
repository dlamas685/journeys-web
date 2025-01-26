import { TIME } from '@/common/constants'
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
		travelMode: z.nativeEnum(TravelMode),
		departure: z.object({
			date: z
				.string({
					required_error: 'La fecha de salida es requerida',
				})
				.date('La fecha de salida no es válida'),
			time: z
				.string({
					required_error: 'La hora de salida es requerida',
				})
				.regex(TIME, {
					message: 'La hora de salida no es válida',
				}),
		}),
		routingPreference: z.nativeEnum(RoutingPreference).optional(),
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
	.refine(
		data =>
			data.intermediates?.every(
				intermediate =>
					intermediate.placeId !== data.origin.placeId &&
					intermediate.placeId !== data.destination.placeId
			),
		{
			message:
				'No pueden haber puntos intermedios iguales al origen o al destino',
			path: ['intermediates'],
		}
	)

export type BasicOptimizationFormSchema = z.infer<
	typeof basicOptimizationFormSchema
>

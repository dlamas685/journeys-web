import { TIME } from '@/common/constants'
import { z } from 'zod'
import { TrafficOption } from '../_enums'
import { TravelMode } from '../_enums/travel-mode.enum'
import { waypointSchema } from './waypoint-schema-form.schema'

export const basicOptimizationFormSchema = z
	.object({
		origin: waypointSchema('El origen es requerido'),
		destination: waypointSchema('El destino es requerido'),
		interestPoints: z
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
		trafficOption: z.nativeEnum(TrafficOption).optional(),
		modifiers: z
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
			data.interestPoints?.every(
				interestPoint =>
					interestPoint.placeId !== data.origin.placeId &&
					interestPoint.placeId !== data.destination.placeId
			),
		{
			message:
				'No pueden haber puntos de interés iguales al origen o al destino',
			path: ['interestPoints'],
		}
	)

export type BasicOptimizationFormSchema = z.infer<
	typeof basicOptimizationFormSchema
>

import { z } from 'zod'
import { upsertFormSchema as activityFormSchema } from '../../activity-templates/[id]/activity-manager/_schemas/upsert-form.schema'
import { ExtraComputation, ReferenceRoute, TrafficModel } from '../_enums'
import { waypointSchema } from './waypoint-schema-form.schema'

export const advancedOptimizationFormSchema = z.object({
	extraComputations: z
		.array(z.nativeEnum(ExtraComputation), {
			required_error: 'Selecciona al menos una opción',
		})
		.min(1, 'Selecciona al menos una opción'),
	trafficModel: z.nativeEnum(TrafficModel).optional(),
	optimizeWaypointOrder: z.boolean().default(false).optional(),
	computeAlternativeRoutes: z.boolean().default(false).optional(),
	requestedReferenceRoutes: z.nativeEnum(ReferenceRoute).optional(),
	interestPoints: z
		.array(
			z.object({
				...waypointSchema().shape,
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
						templateId: z.string().optional(),
						mode: z.string(),
					})
					.optional(),
			})
		)
		.min(0)
		.max(5)
		.optional(),
})

export type AdvancedOptimizationFormSchema = z.infer<
	typeof advancedOptimizationFormSchema
>

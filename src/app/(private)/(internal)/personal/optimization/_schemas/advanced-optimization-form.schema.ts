import { z } from 'zod'
import {
	ExtraComputation,
	ReferenceRoute,
	TollPass,
	TrafficModel,
	VehicleEmissionType,
} from '../_enums'
import { waypointSchema } from './waypoint-schema-form.schema'

const trafficModels = Object.values(TrafficModel) as [string, ...string[]]

const vehicleEmissionTypes = Object.values(VehicleEmissionType) as [
	string,
	...string[],
]

export const advancedOptimizationFormSchema = z.object({
	extraComputations: z
		.array(z.nativeEnum(ExtraComputation), {
			required_error: 'Selecciona al menos una opción',
		})
		.min(1, 'Selecciona al menos una opción'),
	trafficModel: z.enum(trafficModels).optional(),
	optimizeWaypointOrder: z.boolean().default(false).optional(),
	computeAlternativeRoutes: z.boolean().default(false).optional(),
	requestedReferenceRoutes: z.nativeEnum(ReferenceRoute).optional(),
	routeModifiers: z.object({
		vehicleInfo: z.object({
			emissionType: z.enum(vehicleEmissionTypes).optional(),
		}),
		tollPasses: z.array(z.nativeEnum(TollPass)).optional(),
	}),
	intermediates: z.array(waypointSchema()).min(0).max(5).optional(),
})

export type AdvancedOptimizationFormSchema = z.infer<
	typeof advancedOptimizationFormSchema
>

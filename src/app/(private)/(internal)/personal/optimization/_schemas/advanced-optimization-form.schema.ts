import { z } from 'zod'
import {
	ExtraComputation,
	ReferenceRoute,
	TollPass,
	TrafficModel,
	VehicleEmissionType,
} from '../_enums'
import { waypointSchema } from './waypoint-schema-form.schema'

const extraComputations = Object.values(ExtraComputation) as [
	string,
	...string[],
]

const trafficModels = Object.values(TrafficModel) as [string, ...string[]]

const referenceRoutes = Object.values(ReferenceRoute) as [string, ...string[]]

const vehicleEmissionTypes = Object.values(VehicleEmissionType) as [
	string,
	...string[],
]

const tollPasses = Object.values(TollPass) as [string, ...string[]]

export const advancedOptimizationFormSchema = z.object({
	extraComputations: z
		.array(z.enum(extraComputations), {
			required_error: 'Selecciona al menos una opción',
		})
		.min(1, 'Selecciona al menos una opción'),
	trafficModel: z.enum(trafficModels).optional(),
	optimizeWaypointOrder: z.boolean().default(false).optional(),
	computeAlternativeRoutes: z.boolean().default(false).optional(),
	requestedReferenceRoutes: z.enum(referenceRoutes).optional(),
	routeModifiers: z.object({
		vehicleInfo: z.object({
			emissionType: z.enum(vehicleEmissionTypes).optional(),
		}),
		tollPasses: z.array(z.enum(tollPasses)).optional(),
	}),
	intermediates: z.array(waypointSchema()).min(0).max(5).optional(),
})

export type AdvancedOptimizationFormSchema = z.infer<
	typeof advancedOptimizationFormSchema
>

import { z } from 'zod'

export const additionalOptimizationFormSchema = z.object({
	carrierName: z.string({
		required_error: 'El nombre del transportista es requerido',
	}),
	carrierPhone: z.string({
		required_error: 'El teléfono del transportista es requerido',
	}),
	pricePerKg: z
		.number({
			required_error: 'El precio por kilogramo es requerido',
		})
		.positive(),
	pricePerPostal: z
		.number({
			required_error: 'El precio por postal es requerido',
		})
		.positive(),
	maxCapacityKg: z
		.number({
			required_error: 'La capacidad máxima en kilogramos es requerida',
		})
		.positive(),
	fixedCost: z.number().positive().optional(),
	costPerKilometer: z.number().positive().optional(),
	costPerHour: z.number().positive().optional(),
	costPerTraveledHour: z.number().positive().optional(),
	modifiers: z
		.object({
			avoidTolls: z.boolean().optional(),
			avoidHighways: z.boolean().optional(),
			avoidFerries: z.boolean().optional(),
		})
		.optional(),
})

export type AdditionalOptimizationFormSchema = z.infer<
	typeof additionalOptimizationFormSchema
>

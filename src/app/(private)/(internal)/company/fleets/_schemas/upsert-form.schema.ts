import { z } from 'zod'

export const upsertFormSchema = z.object({
	id: z.string().optional(),
	name: z
		.string({
			message: 'El nombre es requerido',
		})
		.min(1, 'El nombre es requerido')
		.max(50, 'El nombre no puede tener más de 50 caracteres'),
	description: z
		.string()
		.max(300, 'La descripción no puede superar los 300 caracteres')
		.optional(),
	maxVehicles: z
		.number()
		.min(2, 'La cantidad de vehículos no puede ser menor a 2')
		.max(10, 'La cantidad de vehículos no puede ser mayor a 10')
		.optional(),
	maxDrivers: z
		.number()
		.min(2, 'La cantidad de conductores no puede ser menor a 2')
		.max(10, 'La cantidad de conductores no puede ser mayor a 10')
		.optional(),
})

export type UpsertFormSchema = z.infer<typeof upsertFormSchema>

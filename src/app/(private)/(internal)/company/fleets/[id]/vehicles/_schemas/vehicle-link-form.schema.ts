import { z } from 'zod'

export const vehicleLinkFormSchema = z.object({
	ids: z
		.array(z.string().uuid('El vehículo seleccionado no es válido'))
		.refine(value => value.some(item => item), {
			message: 'Debe seleccionar al menos un vehículo',
		}),
})

export type VehicleLinkFormSchema = z.infer<typeof vehicleLinkFormSchema>

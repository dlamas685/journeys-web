import { z } from 'zod'

export const driverLinkFormSchema = z.object({
	ids: z
		.array(z.string().uuid('El conductor seleccionado no es válido'))
		.refine(value => value.some(item => item), {
			message: 'Debe seleccionar al menos un conductor',
		}),
})

export type DriverLinkFormSchema = z.infer<typeof driverLinkFormSchema>

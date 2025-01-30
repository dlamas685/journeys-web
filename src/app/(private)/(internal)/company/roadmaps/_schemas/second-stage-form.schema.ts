import { z } from 'zod'
import { serviceSchema } from './service.schema'

export const secondStageFormSchema = z.object({
	fleetId: z.string().uuid('La flota seleccionada no es válida'),
	vehicleId: z.string().uuid('El vehículo seleccionado no es válido'),
	driverId: z.string().uuid('El conductor seleccionado no es válido'),
	services: z
		.array(serviceSchema)
		.min(5, 'Tiene que especificar al menos 5 servicios')
		.max(20, 'No puede especificar más de 20 servicios'),
})

export type SecondStageFormSchema = z.infer<typeof secondStageFormSchema>
